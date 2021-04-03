import {
  Body,
  Controller,
  Get,
  BadRequestException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Delete,
  HttpCode,
  Put
} from "@nestjs/common";
import {In, Not, Raw} from "typeorm";

import {GetUser, IsAuthorizedGuard} from "@modules/auth";
import {User, UserPublicData, UserService} from "@modules/user";
import {File, FilePublicData, FileService} from "@modules/upload";
import {ID} from "@lib/typings";
import {isExtensionValid} from "@lib/extensions";
import {queryLimit} from "@lib/constants";
import {
  AttachmentService,
  OneToOneChatMessageService,
  OneToOneChatMemberService
} from "../services";
import {Attachment, OneToOneChatMember, OneToOneChatMessage} from "../entities";
import {
  CreateMessageDto,
  DeleteMessagesDto,
  EditMessageDto,
  ReadMessageDto
} from "../dtos";
import {
  OneToOneChatMessagePublicData,
  AttachmentPublicData,
  OneToOneChatMemberPublicData
} from "../lib/typings";

@UseGuards(IsAuthorizedGuard)
@Controller("chats")
export class OneToOneChatController {
  constructor(
    private readonly messageService: OneToOneChatMessageService,
    private readonly memberService: OneToOneChatMemberService,
    private readonly attachmentService: AttachmentService,
    private readonly fileService: FileService,
    private readonly userService: UserService
  ) {}

  @Get(":partnerId")
  async get(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<{id: ID; partner: OneToOneChatMemberPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    let member = await this.memberService.findOneByUsers([partner, user]);

    if (!member)
      member = await this.memberService.createByUsers([partner, user]);

    return {
      id: member.chat.id,
      partner: member.public
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

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials.");

    const messages = await this.messageService.find({
      where: {chat: member.chat},
      skip: offset,
      take: queryLimit
    });

    for (let i = 0; i < messages.length; i++) {
      messages[i].replyTo = await this.messageService.findReplyTo(messages[i]);
    }

    return {
      messages: messages.map(msg => msg.public)
    };
  }

  @Post(":partnerId/messages")
  async createMessage(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Body() dto: CreateMessageDto
  ): Promise<{message: OneToOneChatMessagePublicData & AttachmentPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    let member = await this.memberService.findOneByUsers([user, partner]);

    if (!member)
      member = await this.memberService.createByUsers([user, partner]);

    const documents = await this.fileService.find({
      user,
      id: In([...dto.files, ...dto.images, dto.audio])
    });

    const files = documents.filter(
      ({extension}) =>
        !isExtensionValid(extension, "image") &&
        !isExtensionValid(extension, "audio")
    );

    const images = documents.filter(({extension}) =>
      isExtensionValid(extension, "image")
    );

    const audio =
      documents.find(({extension}) => isExtensionValid(extension, "audio")) ||
      null;

    const doesAttachmentExist = !!files.length || !!images.length || audio;

    const attachment = doesAttachmentExist
      ? await this.attachmentService.create({
          audio,
          files,
          images
        })
      : null;

    const replyTo = await this.messageService.findOne({
      where: {id: dto.replyTo, chat: member.chat}
    });

    const message = await this.messageService.create({
      sender: {
        type: "user",
        member
      },
      text: dto.text,
      chat: member.chat,
      attachment,
      replyTo
    });

    return {
      message: message.public
    };
  }

  @Get()
  async getMany(
    @GetUser() user: User
  ): Promise<{
    chats: {
      id: ID;
      partner: OneToOneChatMemberPublicData;
      lastMessage: OneToOneChatMessagePublicData;
    }[];
  }> {
    const members = await this.memberService.find({
      where: {user}
    });

    const chatsIds = members.map(({chat}) => chat.id);

    const messages = await this.messageService.find({
      where: {chat: {id: In(chatsIds)}},
      order: {createdAt: "DESC"},
      take: 1
    });

    const partners = await this.memberService.find({
      where: {
        chat: {id: In(chatsIds)},
        user: {id: Not(user.id)}
      }
    });

    for (let i = 0; i < messages.length; i++) {
      messages[i].replyTo = await this.messageService.findReplyTo(messages[i]);
    }

    return {
      chats: partners.map(partner => {
        const message =
          messages.find(({chat}) => chat.id === partner.chat.id) || null;

        return {
          id: partner.chat.id,
          partner: partner.public,
          lastMessage: message && message.public
        };
      })
    };
  }

  @Get(":partnerId/audio")
  async getAudio(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    audios: {id: ID; url: string; createdAt: Date}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials.");

    const messages = await this.messageService.findManyWithAttachmentByChatId(
      {id: member.chat.id, type: "audio"},
      {offset}
    );

    return {
      audios: messages.map(msg => {
        const {id, audio, createdAt} = msg.public;

        return {
          id,
          url: audio,
          createdAt
        };
      })
    };
  }

  @Get(":partnerId/images")
  async getImages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    images: {id: ID; url: string; createdAt: Date}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials.");

    const messages = await this.messageService.findManyWithAttachmentByChatId(
      {id: member.chat.id, type: "image"},
      {offset}
    );

    return {
      images: messages.reduce((prev, current) => {
        const {id, images, createdAt} = current.public;

        return [...prev, ...images.map(url => ({id, url, createdAt}))];
      }, [])
    };
  }

  @Get(":partnerId/files")
  async getFiles(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    files: {id: ID; files: FilePublicData[]; createdAt: Date}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials");

    const messages = await this.messageService.findManyWithAttachmentByChatId(
      {id: member.chat.id, type: "file"},
      {offset}
    );

    return {
      files: messages.reduce((prev, current) => {
        const {id, files, createdAt} = current.public;

        return [...prev, ...files.map(file => ({...file, id, createdAt}))];
      }, [])
    };
  }

  @HttpCode(204)
  @Delete(":partnerId/messages")
  async deleteMessages(
    @GetUser() user: User,
    @Body() dto: DeleteMessagesDto,
    @Param("partnerId") partnerId: ID
  ): Promise<void> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials");

    await this.messageService.delete({
      chat: member.chat,
      id: In(dto.messages),
      sender: {member}
    });
  }

  @Post(":partnerId/ban")
  async banPartner(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<{id: ID; partner: OneToOneChatMemberPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([partner, user]);

    if (!member) throw new BadRequestException("Invalid credentials");

    const updated = await this.memberService.save({
      id: member.id,
      isBanned: true
    });

    return {
      id: member.chat.id,
      partner: updated.public
    };
  }

  @Post(":partnerId/unban")
  async unbanPartner(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<{id: ID; partner: OneToOneChatMemberPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([partner, user]);

    if (!member) throw new BadRequestException("Invalid credentials");

    const updated = await this.memberService.save({
      id: member.id,
      isBanned: false
    });

    return {
      id: member.chat.id,
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

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials");

    const message = await this.messageService.findOne({
      where: {
        chat: member.chat,
        id: dto.message,
        isRead: false,
        sender: {member: {id: Not(member.id)}}
      }
    });

    if (!message) throw new BadRequestException("Invalid message credentials.");

    await this.messageService.update(
      {
        chat: member.chat,
        sender: {member: {id: Not(member.id)}},
        isRead: false,
        createdAt: Raw(alias => `${alias} <= 'date`, {
          date: message.createdAt.toISOString()
        })
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

    const member = await this.memberService.findOneByUsers([user, partner]);

    if (!member) throw new BadRequestException("Invalid credentials");

    const message = await this.messageService.findOne({
      where: {id: dto.message, chat: member.chat, sender: {member}}
    });

    if (!message) throw new BadRequestException("Invalid message credentials.");

    const documents = await this.fileService.find({
      user,
      id: In([...dto.files, ...dto.images, dto.audio])
    });

    const files = documents.filter(
      ({extension}) =>
        !isExtensionValid(extension, "image") &&
        !isExtensionValid(extension, "audio")
    );

    const images = documents.filter(({extension}) =>
      isExtensionValid(extension, "image")
    );

    const audio =
      documents.find(({extension}) => isExtensionValid(extension, "audio")) ||
      null;

    const doesAttachmentExist = !!files.length || !!images.length || audio;

    const attachment = doesAttachmentExist
      ? await this.attachmentService.create({
          audio,
          files,
          images
        })
      : null;

    const replyTo = await this.messageService.findOne({
      where: {id: dto.replyTo, chat: member.chat}
    });

    const updated = await this.messageService.save({
      id: message.id,
      text: dto.text,
      attachment,
      replyTo
    });

    return {
      message: updated.public
    };
  }
}
