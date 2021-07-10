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
import {In, IsNull, Not} from "typeorm";

import {FilePublicData, FileService} from "@modules/upload";
import {UserService} from "@modules/user";
import {queryLimit} from "@lib/queries";
import {ExtendedSocket, ID} from "@lib/typings";
import {extensions} from "@lib/files";
import {LessThanDate} from "@lib/operators";
import {BadRequestTransformationFilter, WebsocketService} from "@lib/websocket";
import {
  DirectChatPublicData,
  GroupChatMemberPublicData,
  GroupChatMessagePublicData,
  GroupChatPublicData
} from "../lib/typings";
import {GroupChatMemberService, GroupChatMessageService, GroupChatService} from "../services";
import {
  GetGroupChatMessagesDto,
  CreateGroupChatMessageDto,
  GetGroupChatDto,
  GetGroupChatAttachmentsDto,
  CreateGroupChatDto,
  AddGroupChatMemberDto,
  RemoveGroupChatMemberDto, LeaveGroupChatDto, ReadGroupMessageDto, SubscribeGroupChatsDto
} from "./dtos";
import {GroupChatMember} from "../entities";
import {groupChatServerEvents as serverEvents, groupChatClientEvents as clientEvents} from "./events";

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class GroupChatGateway {
  constructor(
    private readonly memberService: GroupChatMemberService,
    private readonly messageService: GroupChatMessageService,
    private readonly chatService: GroupChatService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly websocketService: WebsocketService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage(serverEvents.SUBSCRIBE)
  async handleSubscribingChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: SubscribeGroupChatsDto
  ): Promise<void> {
    const members = await this.memberService.find({
      where: {
        chat: {
          id: In(dto.groups)
        },
        user: socket.user
      }
    });

    members.forEach(({chat}) => {
      socket.join(chat.id);
    });
  }

  @SubscribeMessage(serverEvents.GET_CHATS)
  async handleGettingChats(
    @ConnectedSocket() socket: ExtendedSocket
  ): Promise<{
    chats: ({
      lastMessage: GroupChatMessagePublicData;
      numberOfMembers: number;
      numberOfUnreadMessages: number
    } & GroupChatPublicData)[]
  }> {
    const members = await this.memberService.find({
      where: {
        user: socket.user
      }
    });

    const messages = await this.messageService.find({
      where: {
        chat: {
          id: In(members.map(({chat}) => chat.id))
        }
      },
      take: 1,
      order: {
        createdAt: "DESC"
      }
    });

    const numbersOfMembers: {chatId: ID; number: number}[] = [];
    const numbersOfUnreadMessages: {chatId: ID; number: number}[] = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      const numberOfMembers = await this.memberService.count({
        where: {
          chat: member.chat
        }
      });

      const numberOfUnreadMessages = await this.messageService.count({
        where: [{
          chat: member.chat,
          isRead: false,
          sender: {
            id: Not(member.id)
          }
        }, {
          chat: member.chat,
          isRead: false,
          sender: IsNull()
        }]
      });

      const chatId = member.chat.id;

      numbersOfMembers.push({chatId, number: numberOfMembers});
      numbersOfUnreadMessages.push({chatId, number: numberOfUnreadMessages});
    }

    return {
      chats: members.map((member) => {
        const lastMessage = messages.find((message) => message.chat.id === member.chat.id) || null;
        const {number: numberOfMembers} = numbersOfMembers.find(({chatId}) => chatId === member.chat.id);
        const {number: numberOfUnreadMessages} = numbersOfUnreadMessages.find(({chatId}) => chatId === member.chat.id);

        return {
          ...member.chat.public,
          lastMessage: lastMessage && lastMessage.public,
          member: member.public,
          numberOfMembers, numberOfUnreadMessages
        };
      })
    };
  }


  @SubscribeMessage(serverEvents.GET_MESSAGES)
  async handleGettingMessages(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatMessagesDto
  ): Promise<{messages: GroupChatMessagePublicData[]}> {
    const messages = await this.messageService.find({
      where: {
        chat: {
          id: dto.group
        }
      },
      skip: +dto.skip,
      take: queryLimit,
      order: {
        createdAt: "DESC"
      }
    });

    return {
      messages: messages
        .sort((a, b) => +a.createdAt - +b.createdAt)
        .map((message) => message.public)
    };
  }

  @SubscribeMessage(serverEvents.CREATE_MESSAGE)
  async handleCreatingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateGroupChatMessageDto
  ): Promise<{message: DirectChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

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
      sender: member
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      message: message.public,
      chat: chat.public
    });

    return {
      message: message.public
    };
  }

  @SubscribeMessage(serverEvents.GET_CHAT)
  async handleGettingChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatDto
  ): Promise<{chat: {member: GroupChatMemberPublicData; numberOfMembers: number} & GroupChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const numberOfMembers = await this.memberService.count({
      where: {chat}
    });

    return {
      chat: {
        ...chat.public,
        member: member.public,
        numberOfMembers
      }
    };
  }

  @SubscribeMessage(serverEvents.GET_IMAGES)
  async handleGettingImages(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatAttachmentsDto
  ): Promise<{images: {id: ID; url: string; createdAt: Date}[]}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const messages = await this.messageService
      .findWithAttachments("images", {
        where: {chat},
        order: {
          createdAt: "DESC"
        }
      });

    return {
      images: messages.reduce((prev, current) => {
        const {id, images, createdAt} = current.public;

        return [...prev, ...images.map((url) => ({id, url, createdAt}))];
      }, [])
    };
  }

  @SubscribeMessage(serverEvents.GET_AUDIOS)
  async handleGettingAudios(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatAttachmentsDto
  ): Promise<{audios: {id: ID; url: string; createdAt: Date}[]}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const messages = await this.messageService
      .findWithAttachments("audio", {
        where: {chat},
        order: {
          createdAt: "DESC"
        }
      });

    return {
      audios: messages.map((message) => {
        const msg = message.public;

        return {
          id: msg.id,
          url: msg.audio,
          createdAt: msg.createdAt
        };
      })
    };
  }

  @SubscribeMessage(serverEvents.GET_FILES)
  async handleGettingFiles(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatAttachmentsDto
  ): Promise<{files: {id: ID; file: FilePublicData; createdAt: Date}[]}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const messages = await this.messageService
      .findWithAttachments("files", {
        where: {chat},
        order: {
          createdAt: "DESC"
        }
      });

    return {
      files: messages.reduce((prev, current) => {
        const {id, files, createdAt} = current.public;

        return [...prev, ...files.map((file) => ({id, file, createdAt}))];
      }, [])
    };
  }

  @SubscribeMessage(serverEvents.CREATE_CHAT)
  async handleCreatingChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateGroupChatDto
  ): Promise<{chat: {member: GroupChatMemberPublicData; numberOfMembers: number} & GroupChatPublicData}> {
    const users = (await this.userService.find({
      where: {
        id: In(dto.members)
      }
    })).filter((user) => user.id !== socket.user.id);

    if (!users.length) throw new WsException("No valid members");

    const title = dto.title || `${socket.user.username} ${users.reduce((prev, current) => `${prev}${current.username} `, "").trim()}`;

    const avatar = dto.avatar && await this.fileService.findOne({
      where: {
        id: dto.avatar,
        user: socket.user,
        extension: In(extensions.images)
      }
    });

    const chat = await this.chatService.create({
      title, avatar: avatar && avatar.url
    });

    const members: GroupChatMember[] = [];

    const member = await this.memberService.create({
      user: socket.user,
      chat, role: "owner"
    });

    members.push(member);

    const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);

    sockets.forEach((socket) => socket.join(chat.id));

    for (let i = 0; i < users.length; i++) {
      const user = users[0];

      const member = await this.memberService.create({
        user, chat, role: "member"
      });

      members.push(member);

      const sockets = await this.websocketService.getSocketsByUserId(this.wss, user.id);

      sockets.forEach((socket) => socket.join(chat.id));
    }

    const message = await this.messageService.create({
      chat, isSystem: true,
      text: `${member.user.username} has created the chat!`
    });

    this.wss.to(chat.id).emit(clientEvents.CHAT_CREATED, {
      chat: chat.public,
      member: member.public
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      chat: chat.public,
      message: message.public
    });

    return {
      chat: {
        ...chat.public,
        member: member.public,
        numberOfMembers: members.length
      }
    };
  }

  @SubscribeMessage(serverEvents.ADD_MEMBER)
  async handleAddingMember(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: AddGroupChatMemberDto
  ): Promise<{chat: {member: GroupChatMemberPublicData; numberOfMembers: number} & GroupChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user,
        role: "owner"
      }
    });

    if (!member) throw new WsException("You do not have permission to add members.");

    const user = await this.userService.findOne({
      where: {
        id: dto.member
      }
    });

    if (!user) throw new WsException("User not found.");

    const existed = await this.memberService.findOne({
      where: {
        chat, user
      }
    });

    if (existed)
      throw new WsException("User has already been a member of this chat.");

    const added = await this.memberService.create({
      role: "member", chat, user
    });

    const numberOfMembers = await this.memberService.count({
      where: {chat}
    });

    const message = await this.messageService.create({
      isSystem: true, chat,
      text: `${added.user.username} has joined!`
    });

    this.wss.to(chat.id).emit(clientEvents.MEMBER_ADDED, {
      chat: chat.public,
      member: member.public,
      numberOfMembers
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      chat: chat.public,
      message: message.public
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, added.user.id);

    sockets.forEach((socket) => {
      socket.join(chat.id);

      socket.emit(clientEvents.ADDED, {
        chat: chat.public,
        member: added.public
      });
    });

    return {
      chat: {
        ...chat.public,
        member: added.public,
        numberOfMembers
      }
    };
  }

  @SubscribeMessage(serverEvents.KICK_MEMBER)
  async handleRemovingMember(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: RemoveGroupChatMemberDto
  ): Promise<{chat: {member: GroupChatMemberPublicData; numberOfMembers: number} & GroupChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const owner = await this.memberService.findOne({
      where: {
        chat, user: socket.user,
        role: "owner"
      }
    });

    if (!owner) throw new WsException("You do not have permission to add members.");

    const user = await this.userService.findOne({
      where: {
        id: dto.member
      }
    });

    if (!user) throw new WsException("User not found.");

    const member = await this.memberService.findOne({
      where: {
        user, chat
      }
    });

    if (!member) throw new WsException("User is not a member of this chat.");

    await this.memberService.delete({
      id: member.id
    });

    const numberOfMembers = await this.memberService.count({
      where: {chat}
    });

    const message = await this.messageService.create({
      isSystem: true, chat,
      text: `${member.user.username} has been kicked!`
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);

    sockets.forEach((socket) => {
      socket.leave(chat.id);

      socket.emit(clientEvents.KICKED, {
        chat: chat.public
      });
    });

    this.wss.to(chat.id).emit(clientEvents.MEMBER_KICKED, {
      member: member.public,
      chat: chat.public,
      numberOfMembers
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      message: message.public,
      chat: chat.public
    });

    return {
      chat: {
        ...chat.public,
        member: member.public,
        numberOfMembers
      }
    };
  }

  @SubscribeMessage(serverEvents.LEAVE)
  async handleLeavingChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: LeaveGroupChatDto
  ): Promise<{chat: GroupChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    await this.memberService.delete({
      id: member.id
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);

    sockets.forEach((socket) => socket.leave(chat.id));

    let replacement: GroupChatMember | null = null;

    if (member.isOwner) {
      const candidate = await this.memberService.findOne({
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
        replacement = await this.memberService.save({
          ...candidate,
          role: "owner"
        });
      }
    }

    const numberOfMembers = await this.memberService.count({
      where: {chat}
    });

    const message = await this.messageService.create({
      chat, isSystem: true,
      text: `${member.user.username} left the chat!`
    });

    this.wss.to(chat.id).emit(clientEvents.MEMBER_LEFT, {
      chat: chat.public,
      member: member.public,
      numberOfMembers
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
      chat: chat.public,
      message: message.public
    });

    if (replacement) {
      const message = await this.messageService.create({
        chat, isSystem: true,
        text: `${replacement.user.username} is chat owner now!`
      });

      this.wss.to(chat.id).emit(clientEvents.MESSAGE, {
        chat: chat.public,
        message: message.public
      });

      const sockets = this.websocketService.getSocketsByUserId(this.wss, replacement.user.id);

      sockets.forEach((socket) => socket.emit(clientEvents.OWNER_REPLACEMENT, {
        chat: chat.public,
        member: replacement.public
      }));
    }

    return {
      chat: chat.public
    };
  }

  @SubscribeMessage(serverEvents.READ_MESSAGE)
  async handleReadingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: ReadGroupMessageDto
  ): Promise<{message: GroupChatMessagePublicData; chat: GroupChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.group
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const message = await this.messageService.findOne({
      where: {
        chat, id: dto.message,
        isRead: false,
        sender: {
          id: Not(member.id)
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
        id: Not(member.id)
      }
    }, {
      isRead: true
    });

    this.wss.to(chat.id).emit(clientEvents.MESSAGE_READ, {
      message: message.public,
      chat: chat.public
    });

    return {
      message: message.public,
      chat: chat.public
    };
  }
}