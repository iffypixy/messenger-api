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
import {GroupChatMessagePublicData} from "../lib/typings";
import {clientEvents, events} from "../lib/group-chat-events";

interface JoinEventBody {
  chatId: ID;
}

interface CreatingChatEventBody {
  chatId: ID;
  users: ID[];
}

interface MessageSendingEventBody {
  message: GroupChatMessagePublicData;
  chatId: ID;
}

interface MessageReadingEventBody {
  message: ID[];
  chatId: ID;
}

interface MessageEditingEventBody {
  message: GroupChatMessagePublicData;
  chatId: ID;
}

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
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    const clients = this.websocketsService.getSocketsByUserId(client.user.id);

    clients.forEach(client => client.join(chatId));

    for (let i = 0; i < users.length; i++) {
      const id = users[i];

      const partner = await this.memberService.findOne({
        where: {user: {id}, chat: {id: chatId}}
      });

      const hasAccess = !!partner;

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
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    const clients = this.websocketsService.getSocketsByUserId(client.user.id);

    clients.forEach(client => client.join(chatId));
  }

  @SubscribeMessage(events.MESSAGE_SENDING)
  async handleMessageSendingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {message, chatId}: MessageSendingEventBody
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.MESSAGE_SENDING, {message, chatId});
  }

  @SubscribeMessage(events.MESSAGE_READING)
  async handleMessageReadingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {message, chatId}: MessageReadingEventBody
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.MESSAGE_SENDING, {message, chatId});
  }

  @SubscribeMessage(events.MESSAGE_EDITING)
  async handleMessageEditingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {message, chatId}: MessageEditingEventBody
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.MESSAGE_EDITING, {message, chatId});
  }
}
