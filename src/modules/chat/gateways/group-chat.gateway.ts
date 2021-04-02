import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody
} from "@nestjs/websockets";
import {BadRequestException} from "@nestjs/common";
import {Server} from "socket.io";

import {ExtendedSocket, ID} from "@lib/typings";
import {WebsocketsService} from "@modules/websockets";
import {GroupChatMemberService} from "../services";
import {ChatMessagePublicData} from "../lib/typings";

interface JoinEventBody {
  chatId: ID;
}

interface CreatingChatEventBody {
  chatId: ID;
  users: ID[];
}

interface MessageSendingEventBody {
  message: ChatMessagePublicData;
}

interface MessageReadingEventBody {
  messages: ID[];
  chatId: ID;
}

const prefix = "GROUP_CHAT";

const events = {
  JOIN: `${prefix}:JOIN`,
  CREATING_CHAT: `${prefix}:CREATING_CHAT`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`
};

const clientEvents = {
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`
};

const error = new BadRequestException("Invalid credentials.");

@WebSocketGateway()
export class GroupChatGateway {
  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly memberService: GroupChatMemberService
  ) {}

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage(events.CREATING_CHAT)
  async handleCreatingChatEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {chatId, users}: CreatingChatEventBody
  ): Promise<void> {
    const hasAccess = !!(await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    }));

    if (!hasAccess) throw error;

    const clients = this.websocketsService.getSocketsByUserId(client.user.id);

    clients.forEach(client => client.join(chatId));

    for (let i = 0; i < users.length; i++) {
      const id = users[i];

      const hasAccess = !!(await this.memberService.findOne({
        where: {user: {id}, chat: {id: chatId}}
      }));

      if (!hasAccess) return;

      const sockets = this.websocketsService.getSocketsByUserId(id);

      sockets.forEach(socket => socket.join(chatId));
    }
  }

  @SubscribeMessage(events.JOIN)
  async handleJoinEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {chatId}: JoinEventBody
  ): Promise<void> {
    const hasAccess = !!(await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    }));

    if (!hasAccess) throw error;

    const clients = this.websocketsService.getSocketsByUserId(client.user.id);

    clients.forEach(client => client.join(chatId));
  }

  @SubscribeMessage(events.MESSAGE_SENDING)
  async handleMessageSendingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {message}: MessageSendingEventBody
  ): Promise<void> {
    const hasAccess = !!(await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: message.chatId}}
    }));

    if (!hasAccess) throw error;

    client.to(message.chatId).emit(clientEvents.MESSAGE_SENDING, {message});
  }

  @SubscribeMessage(events.MESSAGE_READING)
  async handleMessageReadingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {messages, chatId}: MessageReadingEventBody
  ): Promise<void> {
    const hasAccess = !!(await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    }));

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.MESSAGE_SENDING, {messages, chatId});
  }
}
