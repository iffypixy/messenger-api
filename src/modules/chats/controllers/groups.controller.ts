import {BadRequestException, Body, Controller, Get, Query} from "@nestjs/common";
import {In, IsNull, Not} from "typeorm";

import {GetUser} from "@modules/auth";
import {FilePublicData} from "@modules/uploads";
import {User} from "@modules/users";
import {ID} from "@lib/typings";
import {GroupsService, GroupMembersService, GroupMessagesService} from "../services";
import {GroupMemberPublicData, GroupMessagePublicData, GroupPublicData} from "../entities";
import {queryLimit} from "@lib/queries";
import {GetMessagesDto} from "../dtos/groups";

@Controller("groups")
export class GroupsController {
  constructor(
    private readonly membersService: GroupMembersService,
    private readonly messagesService: GroupMessagesService,
    private readonly chatsService: GroupsService
  ) {
  }

  @Get()
  async getChats(
    @GetUser() user: User
  ): Promise<{
    chats: {
      details: GroupPublicData;
      member: GroupMemberPublicData;
      lastMessage: GroupMessagePublicData;
      unreads: number;
    }[];
  }> {
    const members = await this.membersService.find({
      where: {user}
    });

    const messages = await this.messagesService.find({
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

    const unreads: {id: ID; amount: number}[] = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];

      const amount = await this.messagesService.count({
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

      unreads.push({
        id: member.chat.id, amount
      });
    }

    return {
      chats: members.map((member) => {
        const lastMessage = messages.find(({chat}) => chat.id === member.chat.id) || null;
        const {amount} = unreads.find(({id}) => id === member.chat.id);

        return {
          details: member.chat.public,
          lastMessage: lastMessage && lastMessage.public,
          member: member.public,
          unreads: amount
        };
      })
    };
  }

  @Get(":id/messages")
  async getMessages(
    @GetUser() user: User,
    @Query("id") id: ID,
    @Body() dto: GetMessagesDto
  ): Promise<{messages: GroupMessagePublicData[]}> {
    const messages = await this.messagesService.find({
      where: {
        chat: {id}
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

  @Get(":id")
  async getChat(
    @GetUser() user: User,
    @Query("id") id: ID
  ): Promise<{
    chat: {
      details: GroupPublicData;
      member: GroupMemberPublicData;
      participants: number;
    };
  }> {
    const chat = await this.chatsService.findOne({
      where: {id}
    });

    const member = await this.membersService.findOne({
      where: {chat, user}
    });

    if (!member) throw new BadRequestException("Chat is not found");

    const participants = await this.membersService.count({
      where: {chat}
    });

    return {
      chat: {
        details: chat.public,
        member: member.public,
        participants
      }
    };
  }

  @Get(":id/attached/images")
  async getAttachedImages(
    @GetUser() user: User,
    @Query("id") id: ID
  ): Promise<{
    images: {
      id: ID;
      url: string;
      createdAt: Date;
    }[];
  }> {
    const member = await this.membersService.findOne({
      where: {
        chat: {id}, user
      }
    });

    if (!member) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.findAttachments("images", {
      where: {
        chat: {id}
      },
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

  @Get(":id/attached/audios")
  async getAttachedAudios(
    @GetUser() user: User,
    @Query("id") id: ID
  ): Promise<{
    audios: {
      id: ID;
      url: string;
      createdAt: Date;
    }[];
  }> {
    const member = await this.membersService.findOne({
      where: {
        chat: {id}, user
      }
    });

    if (!member) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.findAttachments("audio", {
      where: {
        chat: {id}
      },
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

  @Get(":id/attached/files")
  async getAttachedFiles(
    @GetUser() user: User,
    @Query("id") id: ID
  ): Promise<{
    files: {
      id: ID;
      file: FilePublicData;
      createdAt: Date;
    }[];
  }> {
    const member = await this.membersService.findOne({
      where: {
        chat: {id}, user
      }
    });

    if (!member) throw new BadRequestException("Chat is not found");

    const messages = await this.messagesService.findAttachments("files", {
      where: {
        chat: {id}
      },
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