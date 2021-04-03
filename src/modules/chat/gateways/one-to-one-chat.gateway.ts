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
import {OneToOneChatMessagePublicData} from "../lib/typings";

const prefix = "1O1_CHAT";

const events = {
  JOIN: `${prefix}:JOIN`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  BANNING_PARTNER: `${prefix}:BANNING_PARTNER`,
  UNBANNING_PARTNER: `${prefix}:UNBANNING_PARTNER`
};

const clientEvents = {
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  GETTING_BANNED: `${prefix}:GETTING_BANNED`,
  GETTING_UNBANNED: `${prefix}:`
};

interface JoinEventBody {
  chatId: ID;
}

interface MessageSendingEventBody {
  message: OneToOneChatMessagePublicData;
}

interface MessageReadingEventBody {
  messages: ID[];
  chatId: ID;
}

interface BanningPartnerEventBody {
  chatId: ID;
}

interface UnbanningPartnerEventBody {
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
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    const partner = await this.memberService.findOne({
      where: {user: {id: Not(client.user.id)}, chat: {id: chatId}}
    });

    if (!partner) throw error;

    const partners = this.websocketsService.getSocketsByUserId(partner.user.id);

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
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: message.chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(message.chatId).emit(clientEvents.MESSAGE_SENDING, {message});
  }

  @SubscribeMessage(events.MESSAGE_READING)
  async handleMessageReadingEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {messages, chatId}: MessageReadingEventBody
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.MESSAGE_SENDING, {messages, chatId});
  }

  @SubscribeMessage(events.BANNING_PARTNER)
  async handleBanningPartnerEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {chatId}: BanningPartnerEventBody
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.GETTING_BANNED);
  }

  @SubscribeMessage(events.UNBANNING_PARTNER)
  async handleUnbanningPartnerEvent(
    @ConnectedSocket() client: ExtendedSocket,
    @MessageBody() {chatId}: UnbanningPartnerEventBody
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {user: {id: client.user.id}, chat: {id: chatId}}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw error;

    client.to(chatId).emit(clientEvents.GETTING_UNBANNED);
  }
}
