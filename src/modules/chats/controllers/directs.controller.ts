import {BadRequestException, Controller, Get, Param, Query} from "@nestjs/common";
import {In, Not} from "typeorm";

import {GetUser} from "@modules/auth";
import {User, UsersService} from "@modules/users";
import {FilePublicData} from "@modules/uploads";
import {ID} from "@lib/typings";
import {queryLimit} from "@lib/queries";
import {DirectMembersService, DirectMessagesService, DirectsService} from "../services";
import {DirectPublicData, DirectMemberPublicData, DirectMessagePublicData, DirectMessage} from "../entities";
import {GetMessagesDto, GetAttachmentsDto} from "../dtos/directs";

@Controller("directs")
export class DirectsController {
  constructor(
    private readonly membersService: DirectMembersService,
    private readonly messagesService: DirectMessagesService,
    private readonly chatsService: DirectsService,
    private readonly usersService: UsersService
  ) {
  }

  @Get()
  async getChats(
    @GetUser() user: User
  ): Promise<{
    chats: {
      details: DirectPublicData;
      partner: DirectMemberPublicData;
      lastMessage: DirectMessagePublicData;
      isBanned: boolean;
      unread: number;
    }[];
  }> {
    const members = await this.membersService.find({
      where: {user}
    });

    const partners = await this.membersService.find({
      where: {
        chat: {
          id: In(members.map(({chat}) => chat.id))
        },
        user: {
          id: Not(user.id)
        }
      }
    });

    const messages: DirectMessage[] = [];
    const unreads: {id: ID; amount: number}[] = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      const message = await this.messagesService.findOne({
        where: {
          chat: {
            id: member.chat.id
          }
        },
        order: {
          createdAt: "DESC"
        }
      });

      const amount = await this.messagesService.count({
        where: {
          chat: member.chat,
          isRead: false,
          sender: {
            id: Not(member.id)
          }
        }
      });

      messages.push(message);

      unreads.push({
        id: member.chat.id, amount
      });
    }

    return {
      chats: members
        .filter((member) => messages.some(({chat}) => chat.id === member.chat.id))
        .map((member) => {
          const partner = partners.find(({chat}) => chat.id === member.chat.id);
          const message = messages.find(({chat}) => chat.id === member.chat.id);
          const {amount} = unreads.find(({id}) => id === member.chat.id);

          return {
            details: member.chat.public,
            partner: partner.public,
            isBanned: member.public.isBanned,
            lastMessage: message.public,
            unread: amount
          };
        })
    };
  }

  @Get(":partnerId/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query() dto: GetMessagesDto
  ): Promise<{messages: DirectMessagePublicData[]}> {
    const partner = await this.usersService.findOne({
      where: {
        id: partnerId
      }
    });

    if (!partner) throw new BadRequestException("Partner is not found");

    const {chat} = await this.chatsService
      .findOneByUsers([user, partner], {createNew: false});

    if (!chat) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.find({
      where: {chat},
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

  @Get(":partnerId")
  async getChat(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID
  ): Promise<{
    chat: {
      details: DirectPublicData;
      partner: DirectMemberPublicData;
      isBanned: boolean;
    };
  }> {
    const partner = await this.usersService.findOne({
      where: {
        id: partnerId
      }
    });

    if (!partner) throw new BadRequestException("Partner is not found");

    const {chat, first, second} = await this.chatsService
      .findOneByUsers([user, partner], {createNew: true});

    return {
      chat: {
        details: chat.public,
        partner: second.public,
        isBanned: first.isBanned
      }
    };
  }

  @Get(":partnerId/attached/images")
  async getAttachedImages(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query() dto: GetAttachmentsDto
  ): Promise<{
    images: {
      id: ID;
      url: string;
      createdAt: Date;
    }[];
  }> {
    const partner = await this.usersService.findOne({
      where: {
        id: partnerId
      }
    });

    if (!partner) throw new BadRequestException("Partner is not found");

    const {chat} = await this.chatsService
      .findOneByUsers([user, partner], {createNew: false});

    if (!chat) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.findAttachments("images", {
      skip: dto.skip,
      where: {chat},
      order: {
        createdAt: "DESC"
      }
    });

    return {
      images: messages.reduce((prev, current) => {
        const {id, images, createdAt} = current.public;

        return [
          ...prev,
          ...images.map((url) => ({id, url, createdAt}))
        ];
      }, [])
    };
  }

  @Get(":partnerId/attached/audios")
  async getAttachedAudios(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query() dto: GetAttachmentsDto
  ): Promise<{
    audios: {
      id: ID;
      url: string;
      createdAt: Date;
    }[];
  }> {
    const partner = await this.usersService.findOne({
      where: {
        id: partnerId
      }
    });

    if (!partner) throw new BadRequestException("Partner is not found");

    const {chat} = await this.chatsService
      .findOneByUsers([user, partner], {createNew: false});

    if (!chat) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.findAttachments("audio", {
      skip: +dto.skip,
      where: {chat},
      order: {
        createdAt: "DESC"
      }
    });

    return {
      audios: messages.map((message) => {
        const {id, audio: url, createdAt} = message.public;

        return {id, url, createdAt};
      })
    };
  }

  @Get(":partnerId/attached/files")
  async getAttachedFiles(
    @GetUser() user: User,
    @Param("partnerId") partnerId: ID,
    @Query() dto: GetAttachmentsDto
  ): Promise<{
    files: {
      id: ID;
      file: FilePublicData;
      createdAt: Date;
    }[];
  }> {
    const partner = await this.usersService.findOne({
      where: {
        id: partnerId
      }
    });

    if (!partner) throw new BadRequestException("Partner is not found");

    const {chat} = await this.chatsService
      .findOneByUsers([user, partner], {createNew: false});

    if (!chat) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.findAttachments("files", {
      skip: +dto.skip,
      where: {chat},
      order: {
        createdAt: "DESC"
      }
    });

    return {
      files: messages.reduce((prev, current) => {
        const {id, files, createdAt} = current.public;

        return [
          ...prev,
          ...files.map((file) => ({id, file, createdAt}))
        ];
      }, [])
    };
  }
}