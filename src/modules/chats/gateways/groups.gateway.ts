import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {Server} from "socket.io";
import {In, Not} from "typeorm";

import {FilesService} from "@modules/uploads";
import {UsersService} from "@modules/users";
import {ExtendedSocket} from "@lib/typings";
import {extensions} from "@lib/files";
import {LessThanOrEqualDate} from "@lib/operators";
import {BadRequestTransformationFilter, WebsocketService} from "@lib/websocket";
import {DirectPublicData, GroupPublicData} from "../entities";
import {GroupMembersService, GroupMessagesService, GroupsService} from "../services";
import {groupChatServerEvents as serverEvents, groupChatClientEvents as clientEvents} from "./events";
import {
  CreateMessageDto,
  CreateChatDto,
  AddMemberDto,
  KickMemberDto,
  LeaveChatDto,
  ReadMessageDto,
  SubscribeChatsDto
} from "../dtos/groups";

const minAmountOfMembers = 3;

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class GroupsGateway {
  constructor(
    private readonly membersService: GroupMembersService,
    private readonly messagesService: GroupMessagesService,
    private readonly chatsService: GroupsService,
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly websocketService: WebsocketService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage(serverEvents.SUBSCRIBE)
  async subscribeChats(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: SubscribeChatsDto
  ): Promise<void> {
    const members = await this.membersService.find({
      where: {
        chat: {
          id: In(dto.groupsIds)
        },
        user: socket.user
      }
    });

    members.forEach(({chat}) => {
      socket.join(chat.id);
    });
  }

  @SubscribeMessage(serverEvents.CREATE_MESSAGE)
  async createMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateMessageDto
  ): Promise<{message: DirectPublicData}> {
    const chat = await this.chatsService.findOne({
      where: {
        id: dto.groupId
      }
    });

    if (!chat) throw new WsException("Chat is not found");

    const member = await this.membersService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("Chat is not found");

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
      text: dto.text, sender: member
    });

    socket.to(chat.id).emit(clientEvents.MESSAGE, {
      details: chat.public,
      message: message.public
    });

    return {
      message: message.public
    };
  }

  @SubscribeMessage(serverEvents.CREATE_CHAT)
  async createChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateChatDto
  ): Promise<{
    chat: {
      details: GroupPublicData;
    };
  }> {
    const users = await this.usersService.find({
      where: {
        id: In(dto.membersIds)
      }
    });

    if (users.length < minAmountOfMembers) throw new WsException("Not enough members to create a group");

    const title = dto.title || `${socket.user.username}${users.reduce((prev, current) => ` ${prev}${current.username}`, "")}`;

    const image = dto.avatarId ? await this.filesService.findOne({
      where: {
        id: dto.avatarId,
        user: socket.user,
        extension: In(extensions.images)
      }
    }) : null;

    const chat = await this.chatsService.create({
      title, avatar: image && image.url
    });

    const member = await this.membersService.create({
      chat,
      role: "owner",
      user: socket.user
    });

    for (let i = 0; i < users.length; i++) {
      const user = users[0];

      const isOwn = user.id === socket.user.id;

      const member = await this.membersService.create({
        user, chat,
        role: isOwn ? "owner" : "member"
      });

      const sockets = await this.websocketService.getSocketsByUserId(this.wss, user.id);

      sockets.forEach((socket) => {
        socket.join(chat.id);

        if (!isOwn) socket.emit(clientEvents.CHAT_CREATED, {
          details: chat.public,
          member: member.public,
          participants: users.length
        });
      });
    }

    const message = await this.messagesService.create({
      chat, isSystem: true,
      text: `${member.user.username} has created the chat!`
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      details: chat.public,
      message: message.public
    });

    return {
      chat: {
        details: chat.public
      }
    };
  }

  @SubscribeMessage(serverEvents.ADD_MEMBER)
  async addMember(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: AddMemberDto
  ): Promise<void> {
    const chat = await this.chatsService.findOne({
      where: {
        id: dto.groupId
      }
    });

    if (!chat) throw new WsException("Chat is not found");

    const member = await this.membersService.findOne({
      where: {
        chat, role: "owner",
        user: socket.user
      }
    });

    if (!member) throw new WsException("Not permitted to add members");

    const user = await this.usersService.findOne({
      where: {
        id: dto.memberId
      }
    });

    if (!user) throw new WsException("User is not found");

    const existed = await this.membersService.findOne({
      where: {chat, user}
    });

    if (existed) throw new WsException("User has been already a member of this chat");

    const added = await this.membersService.create({
      chat, user,
      role: "member"
    });

    const participants = await this.membersService.count({
      where: {chat}
    });

    this.wss.to(chat.id).emit(clientEvents.MEMBER_ADDED, {
      details: chat.public
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, added.user.id);

    sockets.forEach((socket) => {
      socket.join(chat.id);

      socket.emit(clientEvents.ADDED, {
        participants,
        member: added.public,
        details: chat.public
      });
    });

    const message = await this.messagesService.create({
      isSystem: true, chat,
      text: `${added.user.username} has joined!`
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      details: chat.public,
      message: message.public
    });
  }

  @SubscribeMessage(serverEvents.KICK_MEMBER)
  async kickMember(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: KickMemberDto
  ): Promise<void> {
    const chat = await this.chatsService.findOne({
      where: {
        id: dto.groupId
      }
    });

    if (!chat) throw new WsException("Chat is not found");

    const member = await this.membersService.findOne({
      where: {
        chat, role: "owner",
        user: socket.user
      }
    });

    if (!member) throw new WsException("Not permitted to kick members");

    const user = await this.usersService.findOne({
      where: {
        id: dto.memberId
      }
    });

    if (!user) throw new WsException("User not found");

    const existed = await this.membersService.findOne({
      where: {user, chat}
    });

    if (!existed) throw new WsException("User has not been added yet");

    await this.membersService.delete({
      id: existed.id
    });

    const message = await this.messagesService.create({
      isSystem: true, chat,
      text: `${member.user.username} has been kicked!`
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      details: chat.public,
      message: message.public
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);

    sockets.forEach((socket) => {
      socket.leave(chat.id);

      socket.emit(clientEvents.KICKED, {
        details: chat.public
      });
    });

    this.wss.to(chat.id).emit(clientEvents.MEMBER_KICKED, {
      details: chat.public,
      member: member.public
    });
  }

  @SubscribeMessage(serverEvents.LEAVE)
  async leaveChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: LeaveChatDto
  ): Promise<void> {
    const chat = await this.chatsService.findOne({
      where: {
        id: dto.groupId
      }
    });

    if (!chat) throw new WsException("Chat is not found");

    const member = await this.membersService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not member of this chat");

    await this.membersService.delete({
      id: member.id
    });

    const message = await this.messagesService.create({
      chat, isSystem: true,
      text: `${member.user.username} left the chat!`
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      details: chat.public,
      message: message.public
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);

    sockets.forEach((socket) => {
      socket.leave(chat.id);
    });

    this.wss.to(chat.id).emit(clientEvents.MEMBER_LEFT, {
      details: chat.public,
      member: member.public
    });

    if (member.isOwner) {
      const candidate = await this.membersService.findOne({
        where: {
          chat, user: {
            id: Not(member.user.id)
          }
        },
        order: {
          createdAt: "DESC"
        }
      });

      if (candidate) {
        const replacement = await this.membersService.save({
          ...candidate, role: "owner"
        });

        const sockets = this.websocketService.getSocketsByUserId(this.wss, replacement.user.id);

        sockets.forEach((socket) => {
          socket.emit(clientEvents.OWNER_REPLACEMENT, {
            details: chat.public,
            member: replacement.public
          });
        });

        const message = await this.messagesService.create({
          chat, isSystem: true,
          text: `${replacement.user.username} is chat owner now!`
        });

        this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
          details: chat.public,
          message: message.public
        });
      }
    }
  }

  @SubscribeMessage(serverEvents.READ_MESSAGE)
  async handleReadingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: ReadMessageDto
  ): Promise<void> {
    const chat = await this.chatsService.findOne({
      where: {
        id: dto.groupId
      }
    });

    if (!chat) throw new WsException("Chat is not found");

    const member = await this.membersService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not member of this chat");

    const message = await this.messagesService.findOne({
      where: {
        chat,
        id: dto.messageId,
        isRead: false,
        sender: {
          id: Not(member.id)
        }
      }
    });

    if (!message) throw new WsException("Message is not found");

    await this.messagesService.update({
      chat,
      createdAt: LessThanOrEqualDate(message.createdAt),
      isRead: false,
      sender: {
        id: Not(member.id)
      }
    }, {
      isRead: true
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE_READ, {
      details: chat.public,
      message: message.public
    });
  }
}