import {GetUser, IsAuthorizedGuard} from "@modules/auth";
import {User, UserService} from "@modules/user";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  HttpCode,
  UseInterceptors,
  Delete,
  Put
} from "@nestjs/common";
import {In, Not, Raw} from "typeorm";
import {FileInterceptor} from "@nestjs/platform-express";
import * as mime from "mime";

import {FilePublicData, FileService, UploadService} from "@modules/upload";
import {maxFileSize, queryLimit} from "@lib/constants";
import {BufferedFile, ID} from "@lib/typings";
import {cleanObject} from "@lib/functions";
import {isExtensionValid} from "@lib/extensions";
import {
  AddMemberDto,
  CreateGroupChatDto,
  CreateMessageDto,
  DeleteMessagesDto,
  EditMessageDto,
  KickMemberDto,
  ReadMessageDto
} from "../dtos";
import {
  GroupChatMemberService,
  GroupChatService,
  GroupChatMessageService,
  AttachmentService
} from "../services";
import {minimalNumberOfMembersToCreateGroupChat} from "../lib/constants";
import {
  GroupChatPublicData,
  GroupChatMessagePublicData,
  GroupChatMemberPublicData
} from "../lib/typings";

@UseGuards(IsAuthorizedGuard)
@Controller("group-chats")
export class GroupChatController {
  constructor(
    private readonly chatService: GroupChatService,
    private readonly uploadService: UploadService,
    private readonly userService: UserService,
    private readonly memberService: GroupChatMemberService,
    private readonly messageService: GroupChatMessageService,
    private readonly fileService: FileService,
    private readonly attachmentService: AttachmentService
  ) {}

  @UseInterceptors(
    FileInterceptor("avatar", {
      limits: {fileSize: maxFileSize},
      fileFilter: (_, file, callback) => {
        const ext = `.${mime.getExtension(file.mimetype)}`;

        if (!isExtensionValid(ext, "image")) {
          return callback(
            new BadRequestException("Invalid avatar extension."),
            false
          );
        }

        return callback(null, true);
      }
    })
  )
  @Post()
  async create(
    @GetUser() user: User,
    @Body() dto: CreateGroupChatDto,
    @UploadedFile() avatar: BufferedFile
  ): Promise<{chat: GroupChatPublicData & {numberOfMembers: number}}> {
    const users = await this.userService.find({
      where: {id: In(dto.members)}
    });

    if (users.length < minimalNumberOfMembersToCreateGroupChat)
      throw new BadRequestException("Small amount of members.");

    const title =
      dto.title ||
      `${user.login}, ${users
        .filter((_, idx) => idx <= 5)
        .map(({login}) => login)
        .join(", ")}`;

    const url =
      avatar &&
      (await this.uploadService.upload(avatar.buffer, avatar.mimetype))
        .Location;

    const partial = {title, avatar: url};

    cleanObject(partial);

    const chat = await this.chatService.create(partial);

    await this.memberService.create({user, chat, role: "owner"});

    for (let i = 0; i < users.length; i++) {
      await this.memberService.create({user: users[i], chat, role: "member"});
    }

    const numberOfMembers = await this.memberService.count({where: {chat}});

    return {
      chat: {
        ...chat.public,
        numberOfMembers
      }
    };
  }

  @Get()
  async getMany(
    @GetUser() user: User
  ): Promise<{
    chats: ({lastMessage: GroupChatMessagePublicData} & GroupChatPublicData)[];
  }> {
    const members = await this.memberService.find({where: {user}});

    const messages = await this.messageService.find({
      where: {
        chat: {
          id: In(members.map(({chat}) => chat.id))
        }
      },
      order: {
        createdAt: "DESC"
      },
      take: 1
    });

    for (let i = 0; i < messages.length; i++) {
      messages[i].replyTo = await this.messageService.findReplyTo(messages[i]);
    }

    return {
      chats: members.map(({chat}) => {
        const msg = messages.find(msg => msg.chat.id === chat.id) || null;

        return {
          ...chat.public,
          lastMessage: msg && msg.public
        };
      })
    };
  }

  @Post(":id/messages")
  async createMessage(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Body() dto: CreateMessageDto
  ): Promise<{message: GroupChatMessagePublicData}> {
    const member = await this.memberService.findOne({
      where: {
        chat: {id},
        user
      }
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

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
      chat: member.chat,
      sender: {
        type: "user",
        member
      },
      text: dto.text,
      attachment,
      replyTo
    });

    return {
      message: message.public
    };
  }

  @Get(":id/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{messages: GroupChatMessagePublicData[]}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

    const messages = await this.messageService.find({
      where: {chat: member.chat},
      skip: offset,
      order: {
        createdAt: "DESC"
      },
      take: queryLimit
    });

    for (let i = 0; i < messages.length; i++) {
      messages[i].replyTo = await this.messageService.findReplyTo(messages[i]);
    }

    return {
      messages: messages.map(msg => msg.public)
    };
  }

  @Get(":id")
  async get(
    @GetUser() user: User,
    @Param("id") id: ID
  ): Promise<{chat: GroupChatPublicData & {numberOfMembers: number}}> {
    const member = await this.memberService.findOne({
      where: {
        chat: {id},
        user
      }
    });

    if (!member) throw new NotFoundException("Chat is not found.");

    const numberOfMembers = await this.memberService.count({
      where: {chat: member.chat}
    });

    return {
      chat: {
        ...member.chat.public,
        numberOfMembers
      }
    };
  }

  @Get(":id/files")
  async getFiles(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{files: {id: ID; file: FilePublicData; createdAt: Date}[]}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

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

  @Get(":id/images")
  async getImages(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{images: {id: ID; url: string; createdAt: Date}[]}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

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

  @Get(":id/audios")
  async getAudios(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{audios: {id: ID; url: string; createdAt: Date}[]}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

    const messages = await this.messageService.findManyWithAttachmentByChatId(
      {id: member.chat.id, type: "audio"},
      {offset}
    );

    return {
      audios: messages.map(msg => ({
        id: msg.id,
        url: msg.public.audio,
        createdAt: msg.createdAt
      }))
    };
  }

  @HttpCode(204)
  @Delete(":id/messages")
  async deleteMessages(
    @GetUser() user: User,
    @Body() dto: DeleteMessagesDto,
    @Param("id") id: ID
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

    await this.messageService.delete({
      chat: member.chat,
      id: In(dto.messages),
      sender: {member}
    });
  }

  @Get(":id/members")
  async getChatMembers(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Query("offset", ParseIntPipe) offset: number
  ): Promise<{members: GroupChatMemberPublicData[]}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

    const owners = await this.memberService.find({
      where: {chat: member.chat, user: {id: Not(user.id)}, role: "owner"},
      take: queryLimit,
      skip: offset,
      order: {id: "ASC"}
    });

    const members = await this.memberService.find({
      where: {chat: member.chat, user: {id: Not(user.id)}},
      take: queryLimit - owners.length,
      skip: offset - owners.length,
      order: {id: "ASC"}
    });

    return {
      members: [
        ...owners.map(owner => owner.public),
        ...members.map(member => member.public)
      ]
    };
  }

  @Post(":id/members/add")
  async addMember(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Body() dto: AddMemberDto
  ): Promise<{member: GroupChatMemberPublicData}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

    if (!member.isOwner)
      throw new BadRequestException("You dont have permission to add members");

    const applicant = await this.userService.findById(dto.user);

    if (!applicant)
      throw new BadRequestException("User credentials is invalid");

    const doesExist = await this.memberService.findOne({
      where: {chat: member.chat, user: applicant}
    });

    if (doesExist)
      throw new BadRequestException("User is already member of group-chat");

    const added = await this.memberService.create({
      chat: member.chat,
      role: "member",
      user: applicant
    });

    return {
      member: added.public
    };
  }

  @HttpCode(204)
  @Delete(":id/members/kick")
  async kickMember(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Body() dto: KickMemberDto
  ): Promise<void> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

    if (!member.isOwner)
      throw new BadRequestException("You dont have permission to add members");

    const applicant = await this.userService.findById(dto.user);

    if (!applicant)
      throw new BadRequestException("User credentials is invalid");

    await this.memberService.delete({
      chat: member.chat,
      role: "member",
      user: applicant
    });
  }

  @HttpCode(204)
  @Put(":id/messages/read")
  async readMessage(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Body() dto: ReadMessageDto
  ) {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

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

  @Put(":id/messages/edit")
  async editMessage(
    @GetUser() user: User,
    @Param("id") id: ID,
    @Body() dto: EditMessageDto
  ): Promise<{message: GroupChatMessagePublicData}> {
    const member = await this.memberService.findOne({
      where: {chat: {id}, user}
    });

    const hasAccess = !!member;

    if (!hasAccess) throw new NotFoundException("Chat is not found.");

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
