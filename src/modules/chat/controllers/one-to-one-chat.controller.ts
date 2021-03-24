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
import {FileService} from "@modules/upload";
import {AudioExtension, extensions, ImageExtension} from "@lib/extensions";
import {
  OneToOneChatMessageService,
  OneToOneChatMemberService
} from "../services";
import {CreateMessageDto} from "../dtos";
import {ChatMessagePublicData} from "../lib/typings";
import {OneToOneChatMember} from "../entities";

@UseGuards(IsAuthorizedGuard)
@Controller("chats")
export class OneToOneChatController {
  constructor(
    private readonly messageService: OneToOneChatMessageService,
    private readonly memberService: OneToOneChatMemberService,
    private readonly fileService: FileService,
    private readonly userService: UserService
  ) {}

  @Get(":partnerId/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{messages: ChatMessagePublicData[]}> {
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
  ): Promise<{message: ChatMessagePublicData}> {
    const partner = await this.userService.findById(partnerId);

    if (!partner) throw new NotFoundException("Partner is not found.");

    let member: OneToOneChatMember | null = await this.memberService.findOneByUsers(
      [user, partner]
    );

    if (!member)
      member = await this.memberService.createByUsers([user, partner]);

    const files = await this.fileService.find({
      user,
      id: In([
        ...createMessageDto.files,
        ...createMessageDto.images,
        createMessageDto.audio
      ])
    });

    const message = await this.messageService.create({
      attachment: {
        audio:
          files.find(({extension}) =>
            extensions.audio.includes(extension as AudioExtension)
          ) || null,
        images: files.filter(({extension}) =>
          extensions.image.includes(extension as ImageExtension)
        ),
        files: files.filter(
          ({extension}) => !extensions.all.includes(extension)
        )
      },
      sender: {
        type: "user",
        member
      },
      text: createMessageDto.text,
      chat: member.chat
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
      chats: partners.map(({chat, user}) => ({
        id: chat.id,
        partner: user.public,
        lastMessage: messages.find(({chat}) => chat.id === chat.id).public
      }))
    };
  }
}
