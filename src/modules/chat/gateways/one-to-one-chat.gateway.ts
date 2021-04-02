import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer
} from "@nestjs/websockets";
import {BadRequestException} from "@nestjs/common";
import {Not} from "typeorm";
import {Server} from "socket.io";

import {WebsocketsService} from "@modules/websockets";
import {ExtendedSocket, ID} from "@lib/typings";
import {OneToOneChatMemberService} from "../services";
import {OneToOneChatMember} from "../entities";
import {ChatMessagePublicData} from "../lib/typings";

const prefix = "1O1_CHAT";

const events = {
  JOIN: `${prefix}:JOIN`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`
};

const clientEvents = {
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`
};

interface JoinEventBody {
  chatId: ID;
}

interface MessageSendingEventBody {
  message: ChatMessagePublicData;
}

interface MessageReadingEventBody {
  messages: ID[];
  chatId: ID;
}

const error = new BadRequestException("Invalid credentials.");

@WebSocketGateway()
export class OneToOneChatGateway {
  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly memberService: OneToOneChatMemberService
  ) {}

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage(events.JOIN)
  async handleJoinEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {chatId}: JoinEventBody
  ): Promise<void> {
    const hasAccess = !!(await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    }));

    if (!hasAccess) throw error;

    const member: OneToOneChatMember | null = await this.memberService.findOne({
      where: {user: {id: Not(client.user.id)}, chat: {id: chatId}}
    });

    if (!member) throw error;

    const partners = this.websocketsService.getSocketsByUserId(member.user.id);

    if (!partners.length) throw error;

    const clients = this.websocketsService.getSocketsByUserId(client.user.id);

    clients.forEach(client => client.join(chatId));
    partners.forEach(partner => partner.join(chatId));
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
