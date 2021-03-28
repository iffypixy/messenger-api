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
  UseGuards
} from "@nestjs/common";
import {In, Not} from "typeorm";

import {ID} from "@lib/typings";
import {GetUser, IsAuthorizedGuard} from "@modules/auth";
import {User, UserPublicData, UserService} from "@modules/user";
import {FilePublicData, FileService} from "@modules/upload";
import {extensions, isExtensionValid} from "@lib/extensions";
import {
  OneToOneChatMessageService,
  OneToOneChatMemberService,
  AttachmentService
} from "../services";
import {CreateMessageDto} from "../dtos";
import {AttachmentPublicData, ChatMessagePublicData} from "../lib/typings";
import {OneToOneChatMember} from "../entities";
import {AttachmentType} from "../lib/attachment-types";

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

  @Get(":partnerId/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    messages: ChatMessagePublicData[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member: OneToOneChatMember | null = await this.memberService.findOneByUsers(
      [user, partner]
    );

    if (!member) throw new BadRequestException("Invalid credentials.");

    const messages = await this.messageService.find({
      where: {chat: member.chat},
      skip: offset,
      take: 15
    });

    return {
      messages: messages.map(msg => msg.public)
    };
  }

  @Post(":partnerId/messages")
  async createMessage(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Body() createMessageDto: CreateMessageDto
  ): Promise<{message: ChatMessagePublicData & AttachmentPublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    let member: OneToOneChatMember | null = await this.memberService.findOneByUsers(
      [user, partner]
    );

    if (!member)
      member = await this.memberService.createByUsers([user, partner]);

    const documents = await this.fileService.find({
      user,
      id: In([
        ...createMessageDto.files,
        ...createMessageDto.images,
        createMessageDto.audio
      ])
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

    const types: AttachmentType[] = [];

    if (!!files.length) types.push("files");
    if (!!images.length) types.push("images");
    if (!!audio) types.push("audio");

    const attachment = doesAttachmentExist
      ? await this.attachmentService.create({
          audio,
          files,
          images,
          includes: types
        })
      : null;

    const message = await this.messageService.create({
      sender: {
        type: "user",
        member
      },
      text: createMessageDto.text,
      chat: member.chat,
      attachment
    });

    return {
      message: message.public
    };
  }

  @Get()
  async get(
    @GetUser() user: User
  ): Promise<{
    chats: {
      id: ID;
      partner: UserPublicData;
      lastMessage: ChatMessagePublicData;
    }[];
  }> {
    const members = await this.memberService.find({
      where: {user}
    });

    const chatsIds = members.map(({chat}) => chat.id);

    const messages = await this.messageService.find({
      where: {
        chat: {
          id: In(chatsIds)
        }
      },
      take: 1,
      order: {
        createdAt: "DESC"
      }
    });

    const partners = await this.memberService.find({
      where: {
        chat: {
          id: In(chatsIds)
        },
        user: {
          id: Not(user.id)
        }
      }
    });

    return {
      chats: partners.map(({chat, user}) => {
        const message = messages.find(({chat}) => chat.id === chat.id) || null;

        return {
          id: chat.id,
          partner: user.public,
          lastMessage: message && message.public
        };
      })
    };
  }

  @Get(":partnerId/attachments/audio")
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

  @Get(":partnerId/attachments/images")
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

    const messages = await this.messageService.findManyWithAttachmentByChatId(
      {id: member.chat.id, type: "images"},
      {offset}
    );

    return {
      images: messages.reduce((prev, current) => {
        const {id, images, createdAt} = current.public;

        return [...prev, ...images.map(url => ({id, url, createdAt}))];
      }, [])
    };
  }

  @Get(":partnerId/attachments/files")
  async getFiles(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{
    files: {id: ID; files: FilePublicData[]; createdAt: string}[];
  }> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    const member = await this.memberService.findOneByUsers([user, partner]);

    const messages = await this.messageService.findManyWithAttachmentByChatId(
      {id: member.chat.id, type: "files"},
      {offset}
    );

    return {
      files: messages.reduce((prev, current) => {
        const {id, files, createdAt} = current.public;

        return [...prev, ...files.map(file => ({...file, id, createdAt}))];
      }, [])
    };
  }
}
