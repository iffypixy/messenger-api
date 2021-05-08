import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {In} from "typeorm";

import {queryLimit} from "@lib/requests";
import {ExtendedSocket, ID} from "@lib/typings";
import {extensions} from "@lib/files";
import {WebsocketsService} from "@lib/websockets";
import {FilePublicData, FileService} from "@modules/upload";
import {UserService} from "@modules/user";
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
  RemoveGroupChatMemberDto
} from "./dtos";

@WebSocketGateway()
export class GroupChatGateway {
  constructor(
    private readonly memberService: GroupChatMemberService,
    private readonly messageService: GroupChatMessageService,
    private readonly chatService: GroupChatService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly websocketService: WebsocketsService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  @SubscribeMessage("GROUP_CHAT:GET_CHATS")
  async handleGettingChats(
    @ConnectedSocket() socket: ExtendedSocket
  ): Promise<{chats: {chat: GroupChatPublicData; lastMessage: GroupChatMessagePublicData}[]}> {
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

    return {
      chats: members.map((member) => {
        const lastMessage = messages.find((message) => message.chat.id === member.chat.id) || null;

        return {
          chat: member.chat.public,
          lastMessage: lastMessage && lastMessage.public,
          member: member.public
        };
      })
    };
  }


  @SubscribeMessage("GROUP_CHAT:GET_MESSAGES")
  async handleGettingMessages(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatMessagesDto
  ): Promise<{messages: GroupChatMessagePublicData[]}> {
    const messages = await this.messageService.find({
      where: {
        chat: {
          id: dto.chat
        }
      },
      skip: +dto.skip,
      take: queryLimit
    });

    return {
      messages: messages.map((message) => message.public)
    };
  }

  @SubscribeMessage("GROUP_CHAT:CREATE_MESSAGE")
  async handleCreatingMessage(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateGroupChatMessageDto
  ): Promise<{message: DirectChatPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
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
        user: socket.user,
        extension: In(extensions.all)
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
      chat, parent, audio, files,
      images, sender: member,
      text: dto.text
    });

    socket.to(chat.id).emit("GROUP_CHAT:MESSAGE", {
      message: message.public,
      chat: chat.public
    });

    return {
      message: message.public
    };
  }

  @SubscribeMessage("GROUP_CHAT:GET_CHAT")
  async handleGettingChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatDto
  ): Promise<{chat: GroupChatPublicData; member: GroupChatMemberPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
      }
    });

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    return {
      chat: chat.public,
      member: member.public
    };
  }

  @SubscribeMessage("GROUP_CHAT:GET_IMAGES")
  async handleGettingImages(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatAttachmentsDto
  ): Promise<{images: {id: ID; image: string; createdAt: Date}[]}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const messages = await this.messageService.findWithAttachments("images", {
      where: {chat}
    });

    return {
      images: messages.reduce((prev, current) => {
        const {id, images, createdAt} = current.public;

        return [...prev, ...images.map((image) => ({id, image, createdAt}))];
      }, [])
    };
  }

  @SubscribeMessage("GROUP_CHAT:GET_AUDIOS")
  async handleGettingAudios(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatAttachmentsDto
  ): Promise<{audios: {id: ID; audio: string; createdAt: Date}[]}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const messages = await this.messageService.findWithAttachments("audio", {
      where: {chat}
    });

    return {
      audios: messages.map((message) => {
        const msg = message.public;

        return {
          id: msg.id,
          audio: msg.audio,
          createdAt: msg.createdAt
        };
      })
    };
  }

  @SubscribeMessage("GROUP_CHAT:GET_FILES")
  async handleGettingFiles(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: GetGroupChatAttachmentsDto
  ): Promise<{files: {id: ID; file: FilePublicData; createdAt: Date}[]}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
      }
    });

    if (!chat) throw new WsException("Chat is not found.");

    const member = await this.memberService.findOne({
      where: {
        chat, user: socket.user
      }
    });

    if (!member) throw new WsException("You are not a member of this chat.");

    const messages = await this.messageService.findWithAttachments("files", {
      where: {chat}
    });

    return {
      files: messages.reduce((prev, current) => {
        const {id, files, createdAt} = current.public;

        return [...prev, ...files.map((file) => ({id, file, createdAt}))];
      }, [])
    };
  }

  @SubscribeMessage("GROUP_CHAT:CREATE_CHAT")
  async handleCreatingChat(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: CreateGroupChatDto
  ): Promise<{chat: GroupChatPublicData; member: GroupChatMemberPublicData}> {
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

    const member = await this.memberService.create({
      user: socket.user,
      chat, role: "owner"
    });

    for (let i = 0; i < users.length; i++) {
      const user = users[0];

      await this.memberService.create({
        user, chat, role: "member"
      });

      const sockets = await this.websocketService.getSocketsByUserId(this.wss, user.id);

      sockets.forEach((socket) => socket.join(chat.id));
    }

    this.wss.to(chat.id).emit("GROUP_CHAT:CHAT_CREATED", {
      chat: chat.public,
      member: member.public
    });

    return {
      chat: chat.public,
      member: member.public
    };
  }

  @SubscribeMessage("GROUP_CHAT:ADD_MEMBER")
  async handleAddingMember(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: AddGroupChatMemberDto
  ): Promise<{member: GroupChatMemberPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
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

    const added = await this.memberService.create({
      role: "member", chat, user
    });

    const message = await this.messageService.create({
      isSystem: true, chat,
      text: `${added.user.username} has joined!`
    });

    this.wss.to(chat.id).emit("GROUP_CHAT:MEMBER_ADDED", {
      chat: chat.public,
      member: member.public
    });

    this.wss.to(chat.id).emit("GROUP_CHAT:MESSAGE", {
      chat: chat.public,
      message: message.public
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, added.user.id);

    sockets.forEach((socket) => {
      socket.join(chat.id);

      socket.emit("GROUP_CHAT:ADDED", {
        chat: chat.public,
        member: added.public
      });
    });

    return {
      member: added.public
    };
  }

  @SubscribeMessage("GROUP_CHAT:REMOVE_MEMBER")
  async handleRemovingMember(
    @ConnectedSocket() socket: ExtendedSocket,
    @MessageBody() dto: RemoveGroupChatMemberDto
  ): Promise<{member: GroupChatMemberPublicData}> {
    const chat = await this.chatService.findOne({
      where: {
        id: dto.chat
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

    await this.memberService.delete(member);

    const message = await this.messageService.create({
      isSystem: true, chat,
      text: `${member.user.username} has left!`
    });

    this.wss.to(chat.id).emit("GROUP_CHAT:MEMBER_LEFT",  {
      member: member.public,
      chat: chat.public
    });

    const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);

    sockets.forEach((socket) => {
      socket.leave(chat.id);

      socket.emit("GROUP_CHAT:REMOVED", {
        chat: chat.public
      });
    });

    this.wss.to(chat.id).emit("GROUP_CHAT:MESSAGE",  {
      message: message.public,
      chat: chat.public
    });

    return {
      member: member.public
    };
  }
}