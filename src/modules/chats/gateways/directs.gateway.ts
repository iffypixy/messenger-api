import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {In, Not} from "typeorm";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";

import {FilesService} from "@modules/uploads";
import {UsersService} from "@modules/users";
import {ExtendedSocket} from "@lib/typings";
import {extensions} from "@lib/files";
import {BadRequestTransformationFilter, WebsocketService} from "@lib/websocket";
import {LessThanDate} from "@lib/operators";
import {DirectMembersService, DirectMessagesService, DirectsService} from "../services";
import {CreateMessageDto, BanPartnerDto, UnbanPartnerDto, ReadMessageDto} from "../dtos/directs";
import {DirectMemberPublicData, DirectMessagePublicData, DirectPublicData} from "../entities";
import {directChatServerEvents as serverEvents, directChatClientEvents as clientEvents} from "./events";

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class DirectsGateway {
  constructor(
    private readonly memberService: DirectMembersService,
    private readonly messageService: DirectMessagesService,
    private readonly chatService: DirectsService,
    private readonly fileService: FilesService,
    private readonly userService: UsersService,
    private readonly websocketsService: WebsocketService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage(serverEvents.CREATE_MESSAGE)
  async handleCreatingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateMessageDto
  ): Promise<{message: DirectMessagePublicData}> {
    const error = new WsException("Invalid credentials.");

    if (dto.partner === socket.user.id) throw error;

    const partner = await this.userService.findOne({
      where: {
        id: dto.partner
      }
    });

    if (!partner) throw error;

    let {chat, first, second} = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);

    if (chat && (first.isBanned || second.isBanned)) throw new WsException("No permission to send message to this partner.");

    if (!chat) {
      chat = await this.chatService.create({});

      first = await this.memberService.create({
        user: socket.user, chat
      });

      second = await this.memberService.create({
        user: partner, chat
      });
    }

    const parent = dto.parent && await this.messageService.findOne({
      where: {
        id: dto.parent, chat
      }
    });

    const files = dto.files && await this.fileService.find({
      where: {
        id: In(dto.files),
        user: socket.user
      }
    });

    const images = dto.images && await this.fileService.find({
      where: {
        id: In(dto.images),
        user: socket.user,
        extension: In(extensions.images)
      }
    });

    const audio = dto.audio && await this.fileService.findOne({
      where: {
        id: dto.audio,
        user: socket.user,
        extension: In(extensions.audios)
      }
    });

    const message = await this.messageService.create({
      chat, parent, audio,
      files: !audio ? files : null,
      images: !audio ? images : null,
      text: !audio ? dto.text : null,
      sender: first
    });

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.MESSAGE, {
        message: message.public,
        chat: chat.public,
        partner: first.public,
        isBanned: second.public.isBanned
      });
    });

    return {
      message: message.public
    };
  }

  @SubscribeMessage(serverEvents.BAN_PARTNER)
  async handleBanningPartner(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: BanPartnerDto
  ): Promise<{chat: {partner: DirectMemberPublicData; isBanned: boolean} & DirectPublicData}> {
    const {chat, first, second} = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);

    if (!chat) throw new WsException("Chat is not found.");

    if (second.isBanned) throw new WsException("Partner has been already banned.");

    const member = await this.memberService.save({
      ...second,
      isBanned: true
    });

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.BANNED, {
        chat: chat.public,
        partner: first.public
      });
    });

    return {
      chat: {
        ...chat.public,
        partner: member.public,
        isBanned: first.isBanned
      }
    };
  }

  @SubscribeMessage(serverEvents.UNBAN_PARTNER)
  async handleUnbanningPartner(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: UnbanPartnerDto
  ): Promise<{chat: {partner: DirectMemberPublicData; isBanned: boolean} & DirectPublicData}> {
    const {chat, first, second} = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);

    if (!chat) throw new WsException("Chat is not found.");

    if (!second.isBanned) throw new WsException("Partner has been already unbanned.");

    const member = await this.memberService.save({
      ...second,
      isBanned: false
    });

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.UNBANNED, {
        chat: chat.public,
        partner: first.public
      });
    });

    return {
      chat: {
        ...chat.public,
        partner: member.public,
        isBanned: first.isBanned
      }
    };
  }

  @SubscribeMessage(serverEvents.READ_MESSAGE)
  async handleReadingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: ReadMessageDto
  ): Promise<{chat: DirectPublicData; message: DirectMessagePublicData}> {
    const {chat, first} = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);

    if (!chat) throw new WsException("Chat is not found.");

    const message = await this.messageService.findOne({
      where: {
        chat, id: dto.message,
        isRead: false,
        sender: {
          id: Not(first.id)
        }
      }
    });

    if (!message) throw new WsException("Message is not found.");

    await this.messageService.update({
      id: message.id
    }, {
      isRead: true
    });

    await this.messageService.update({
      chat,
      createdAt: LessThanDate(message.createdAt),
      isRead: false,
      sender: {
        id: Not(first.id)
      }
    }, {
      isRead: true
    });

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, dto.partner);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.MESSAGE_READ, {
        message: message.public,
        chat: chat.public,
        partner: first.public
      });
    });

    return {
      message: message.public,
      chat: chat.public
    };
  }
}