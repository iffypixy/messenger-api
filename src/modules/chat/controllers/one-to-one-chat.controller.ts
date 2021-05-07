import {Body, Controller, Get, BadRequestException, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards, Delete, HttpCode, Put} from "@nestjs/common";

import {GetUser, IsAuthorizedGuard} from "@modules/auth";
import {User, UserService} from "@modules/user";
import {FilePublicData, FileService} from "@modules/upload";
import {ID} from "@lib/typings";
import {queryLimit} from "@lib/requests";
import {OneToOneChatMessage} from "../entities";
import {OneToOneChatMessageService, OneToOneChatMemberService, OneToOneChatService} from "../services";
import {CreateMessageDto, DeleteMessagesDto, EditMessageDto, ReadMessageDto} from "../dtos";
import {OneToOneChatMessagePublicData, OneToOneChatMemberPublicData, OneToOneChatPublicData} from "../lib/typings";
import {In, LessThan, MoreThan, Not} from "typeorm";

@UseGuards(IsAuthorizedGuard)
@Controller("1o1-chats")
export class OneToOneChatController {
  constructor(
    private readonly messageService: OneToOneChatMessageService,
    private readonly memberService: OneToOneChatMemberService,
    private readonly chatService: OneToOneChatService,
    private readonly fileService: FileService,
    private readonly userService: UserService
  ) {}

  @Get(":partnerId")
  async get(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<OneToOneChatPublicData & {partner: OneToOneChatMemberPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat, first} = await this.chatService.findOneByUsersIds([partner.id, user.id]);

    if (!chat) throw new NotFoundException("Chat is not found.");

    return {
      ...chat.public,
      partner: first.public
    };
  }

  @Get(":partnerId/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    messages: OneToOneChatMessagePublicData[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Chat is not found.");

    const messages = await this.messageService.find({
      where: {
        chat
      },
      skip: offset,
      take: queryLimit
    });

    return {
      messages: messages.map(msg => msg.public)
    };
  }

  @HttpCode(201)
  @Post(":partnerId/messages")
  async createMessage(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Body() dto: CreateMessageDto
  ): Promise<{message: OneToOneChatMessagePublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    let {chat, first} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) {
      chat = await this.chatService.create({});

      first = await this.memberService.create({user, chat});
      await this.memberService.create({user: partner, chat});
    }

    const parent = await this.messageService.findOne({
      where: {
        id: dto.parent,
        chat: chat
      }
    });

    const message = await this.messageService.create({
      sender: first,
      text: dto.text,
      chat: chat, parent
    });

    return {
      message: message.public
    };
  }

  @Get()
  async getMany(
    @GetUser() user: User,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    chats: (OneToOneChatPublicData & {
      partner: OneToOneChatMemberPublicData;
      lastMessage: OneToOneChatMessagePublicData;
    })[];
  }> {
    const members = await this.memberService.find({
      where: {
        user
      },
      skip: offset,
      take: queryLimit
    });

    const chats = members.map(({chat}) => chat);

    const messages = await this.messageService.find({
      where: {
        chat: In(chats)
        },
      order: {
        createdAt: "DESC"
      },
      take: 1
    });

    const partners = await this.memberService.find({
      where: {
        chat: In(chats),
        user: {
          id: Not(user.id)
        }
      }
    });

    return {
      chats: chats.map((chat) => {
        const partner = partners.find((partner) => partner.chat.id === chat.id);

        if (!partner) return;

        const message = messages.find(({chat}) => chat.id === partner.chat.id) || null;

        return {
          ...chat.public,
          partner: partner.public,
          lastMessage: message && message.public
        };
      }).filter(Boolean)
    };
  }

  @Get(":partnerId/audio")
  async getAudio(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    audios: {id: ID; audio: string; createdAt: Date}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Invalid credentials.");

    const messages = await this.messageService.find({
      where: {
         chat, audio: Not(null)
      }
    });

    return {
      audios: messages.map((message) => {
        const {id, audio, createdAt} = message.public;

        return {id, audio, createdAt};
      })
    };
  }

  @Get(":partnerId/images")
  async getImages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    images: {id: ID; image: string; createdAt: Date}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Invalid credentials.");

    const messages = await this.messageService.find({
      where: {
        chat, images: Not(null)
      }
    });

    return {
      images: messages.reduce((prev, current) => {
        const {id, images, createdAt} = current.public;

        return [...prev, ...images.map((image) => ({id, image, createdAt}))];
      }, [])
    };
  }

  @Get(":partnerId/files")
  async getFiles(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    files: {id: ID; file: FilePublicData; createdAt: Date}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Invalid credentials");

    const messages = await this.messageService.find({
      where: {
        chat, files: Not(null)
      }
    });

    return {
      files: messages.reduce((prev, current) => {
        const {id, files, createdAt} = current.public;

        return [...prev, ...files.map((file) => ({id, file, createdAt}))];
      }, [])
    };
  }

  @Delete(":partnerId/messages")
  async deleteMessages(
    @GetUser() user: User,
    @Body() dto: DeleteMessagesDto,
    @Param("partnerId") partnerId: ID
  ): Promise<void> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat, first} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Chat is not found.");

    await this.messageService.delete({
      id: In(dto.messages),
      chat, sender: first
    });
  }

  @Post(":partnerId/ban")
  async banPartner(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<OneToOneChatPublicData & {partner: OneToOneChatMemberPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat, second} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Chat is not found.");

    const updated = await this.memberService.save({
      ...second,
      isBanned: true
    });

    return {
      ...chat.public,
      partner: updated.public
    };
  }

  @Post(":partnerId/unban")
  async unbanPartner(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<OneToOneChatPublicData & {partner: OneToOneChatMemberPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat, second} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Chat is not found.");

    const updated = await this.memberService.save({
      ...second,
      isBanned: false
    });

    return {
      ...chat.public,
      partner: updated.public
    };
  }

  @HttpCode(204)
  @Put(":partnerId/messages/read")
  async readMessage(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Body() dto: ReadMessageDto
  ) {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat, second} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Chat is not found.");

    const message = await this.messageService.findOne({
      where: {
        id: dto.message,
        chat,
        isRead: false,
        sender: second
      }
    });

    if (!message) throw new BadRequestException("Invalid message credentials.");

    await this.messageService.update(
      {
        chat,
        sender: second,
        isRead: false,
        createdAt: LessThan(message.createdAt)
      },
      {
       isRead: true
      }
    );
  }

  @Put(":partnerId/messages/edit")
  async editMessage(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Body() dto: EditMessageDto
  ): Promise<{message: OneToOneChatMessagePublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const {chat, first} = await this.chatService.findOneByUsersIds([user.id, partner.id]);

    if (!chat) throw new BadRequestException("Chat is not found.");

    const message = await this.messageService.findOne({
      where: {
        id: dto.message,
        chat: chat,
        sender: first
      }
    });

    if (!message) throw new BadRequestException("Invalid message credentials.");

    let parent: OneToOneChatMessage | null = null;

    if (dto.parent) {
      parent = await this.messageService.findOne({
        where: {
          id: dto.parent,
          chat
        }
      });

      if (!parent) throw new NotFoundException("Parent message is not found.");
    }

    const updated = await this.messageService.save({
      ...message,
      text: dto.text,
      isEdited: true,
      parent
    });

    return {
      message: updated.public
    };
  }
}
