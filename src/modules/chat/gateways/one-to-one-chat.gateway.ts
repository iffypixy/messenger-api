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

import {ExtendedSocket, ID} from "@lib/typings";
import {OneToOneChatMemberService, ChatGatewayService} from "../services";
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
    private readonly service: ChatGatewayService,
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
      where: {user: {id: client.userId}, chat: {id: chatId}}
    }));

    if (!hasAccess) throw error;

    const member: OneToOneChatMember | null = await this.memberService.findOne({
      where: {user: {id: Not(client.userId)}, chat: {id: chatId}}
    });

    if (!member) throw error;

    const partner: ExtendedSocket | null = this.service.getSocketByUserId(
      this.wss,
      member.id
    );

    if (!partner) throw error;

    client.join(chatId);
    partner.join(chatId);
  }

  @SubscribeMessage(events.MESSAGE_SENDING)
  async handleMessageSendingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {message}: MessageSendingEventBody
  ): Promise<void> {
    const hasAccess = !!(await this.memberService.findOne({
      where: {user: {id: client.userId}, chat: {id: message.chatId}}
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
      where: {user: {id: client.userId}, chat: {id: chatId}}
    }));

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.MESSAGE_SENDING, {messages, chatId});
  }
}
