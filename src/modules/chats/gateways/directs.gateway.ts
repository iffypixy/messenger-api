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
import {DirectMessagePublicData} from "../entities";
import {directChatServerEvents as serverEvents, directChatClientEvents as clientEvents} from "./events";

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class DirectsGateway {
  constructor(
    private readonly membersService: DirectMembersService,
    private readonly messagesService: DirectMessagesService,
    private readonly chatsService: DirectsService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
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
    if (dto.partnerId === socket.user.id) throw new WsException("Not permitted to send message to yourself");

    const partner = await this.usersService.findOne({
      where: {
        id: dto.partnerId
      }
    });

    if (!partner) throw new WsException("Partner is not found");

    let {chat, first, second} = await this.chatsService
      .findOneByUsers([socket.user, partner], {createNew: true});

    if (first.isBanned || second.isBanned)
      throw new WsException("Not permitted to send message to this partner");

    const parent = dto.parentId && await this.messagesService.findOne({
      where: {
        id: dto.parentId, chat
      }
    });

    const audio = dto.audioId ? await this.filesService.findOne({
      where: {
        id: dto.audioId,
        user: socket.user,
        extension: In(extensions.audios)
      }
    }) : null;

    const files = (dto.filesIds && !audio) ? await this.filesService.find({
      where: {
        id: In(dto.filesIds),
        user: socket.user
      }
    }) : null;

    const images = (dto.imagesIds && !audio) ? await this.filesService.find({
      where: {
        id: In(dto.imagesIds),
        user: socket.user,
        extension: In(extensions.images)
      }
    }) : null;

    const message = await this.messagesService.create({
      chat, parent, audio, files, images,
      text: dto.text, sender: first
    });

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.MESSAGE, {
        details: chat.public,
        message: message.public,
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
  ): Promise<void> {
    const partner = await this.usersService.findOne({
      where: {
        id: dto.partnerId
      }
    });

    if (!partner) throw new WsException("Partner is not found");

    const {chat, first, second} = await this.chatsService
      .findOneByUsers([socket.user, partner], {createNew: false});

    if (!chat) throw new WsException("Chat is not found");

    if (second.isBanned) throw new WsException("Partner has been already banned");

    await this.membersService.update(
      {id: second.id},
      {isBanned: true},
      {retrieve: false}
    );

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.BANNED, {
        details: chat.public,
        partner: first.public
      });
    });
  }

  @SubscribeMessage(serverEvents.UNBAN_PARTNER)
  async handleUnbanningPartner(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: UnbanPartnerDto
  ): Promise<void> {
    const partner = await this.usersService.findOne({
      where: {
        id: dto.partnerId
      }
    });

    if (!partner) throw new WsException("Partner is not found");

    const {chat, first, second} = await this.chatsService
      .findOneByUsers([socket.user, partner], {createNew: false});

    if (!chat) throw new WsException("Chat is not found");

    if (!second.isBanned) throw new WsException("Partner has been already unbanned");

    await this.membersService.update(
      {id: second.id},
      {isBanned: false},
      {retrieve: false}
    );

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.UNBANNED, {
        details: chat.public,
        partner: first.public
      });
    });
  }

  @SubscribeMessage(serverEvents.READ_MESSAGE)
  async handleReadingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: ReadMessageDto
  ): Promise<void> {
    const partner = await this.usersService.findOne({
      where: {
        id: dto.partnerId
      }
    });

    if (!partner) throw new WsException("Partner is not found");

    const {chat, first, second} = await this.chatsService
      .findOneByUsers([socket.user, partner], {createNew: false});

    if (!chat) throw new WsException("Chat is not found");

    const message = await this.messagesService.findOne({
      where: {
        chat,
        id: dto.messageId,
        isRead: false,
        sender: {
          id: Not(first.id)
        }
      }
    });

    if (!message) throw new WsException("Message is not found");

    await this.messagesService.update(
      {id: dto.messageId},
      {isRead: true},
      {retrieve: false}
    );

    await this.messagesService.update(
      {
        chat,
        createdAt: LessThanDate(message.createdAt),
        isRead: false,
        sender: {
          id: Not(first.id)
        }
      },
      {isRead: true},
      {retrieve: false}
    );

    const sockets = this.websocketsService.getSocketsByUserId(this.wss, dto.partnerId);

    sockets.forEach((client) => {
      socket.to(client.id).emit(clientEvents.MESSAGE_READ, {
        message: message.public,
        details: chat.public,
        partner: first.public,
        isBanned: second.isBanned
      });
    });
  }
}