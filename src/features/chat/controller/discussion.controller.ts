import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query
} from "@nestjs/common";
import {Equal, In, Not} from "typeorm";

import {GetUser} from "@features/auth";
import {User, UserPublicData, UserService} from "@features/user";
import {ID} from "@lib/types";
import {FileService} from "@features/upload";
import {extensions} from "@lib/extensions";
import {ChatService, MessageService} from "../service";
import {DiscussionPublicData, MessagePublicData} from "../entity";
import {CreateMessageDto, CreateDiscussionDto} from "../dto";

@Controller("discussions")
export class DiscussionController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {
  }

  @Post()
  async createDiscussion(
    @Body() {membersIds, title}: CreateDiscussionDto,
    @GetUser() user: User
  ): Promise<{discussion: DiscussionPublicData}> {
    const members: UserPublicData[] = [];

    const allMembersIds: ID[] = [...membersIds, user.id].filter((id, idx, arr) => arr.indexOf(id) === idx);

    for (let i = 0; i < allMembersIds.length; i++) {
      const member = await this.userService.findById(allMembersIds[i]);

      if (!member) continue;

      members[i] = member;
    }

    const discussion = await this.chatService.createOne({
      members, type: "discussion",
      title: title || members.map(({fullName}) => fullName).join(", ")
    });

    return {
      discussion: discussion.getDiscussionPublicData()
    };
  }

  @Post(":discussionId/messages")
  async createMessage(
    @GetUser() user: User,
    @Param("discussionId") discussionId: ID,
    @Body() {text, filesIds, imagesIds, audioId}: CreateMessageDto
  ): Promise<{message: MessagePublicData}> {
    const discussion = await this.chatService.findOne({where: {id: discussionId}});

    if (!discussion) throw new NotFoundException("Discussion not found");

    const message = await this.messageService.createOne({
      sender: user, chat: discussion, read: false, text,
      attachment: {
        audio: audioId && await this.fileService.findOne({id: audioId, user, extension: In(extensions.audio)}),
        images: imagesIds && await this.fileService.find({id: In(imagesIds), user, extension: In(extensions.image)}),
        files: filesIds && await this.fileService.find({id: In(filesIds), user})
      }
    });

    return {
      message: message.getPublicData()
    };
  }

  @Get(":discussionId/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("discussionId") discussionId: ID,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("skip", ParseIntPipe) skip: number
  ): Promise<{messages: MessagePublicData[]}> {
    const discussion = await this.chatService.findOne({where: {id: discussionId}});

    if (!discussion) throw new NotFoundException("Discussion not found");

    const messages = await this.messageService.findMany({
      where: {chat: discussion},
      relations: ["attachment.files", "attachment.images", "attachment.audio", "chat", "sender"],
      order: {createdAt: "DESC"},
      skip, take: limit
    });

    return {
      messages: messages.map((msg) => msg.getPublicData()).reverse()
    };
  }

  @Get()
  async getDiscussions(
    @GetUser() user: User
  ): Promise<{discussions: (DiscussionPublicData & {lastMessage: MessagePublicData, unreadMessagesNumber: number})[]}> {
    let discussions = await this.chatService.findMany({where: {type: "discussion"}, relations: ["members"]});

    discussions = discussions.filter(({members}) => members.map(({id}) => id).includes(user.id));

    const discussionsPublicData:
      (DiscussionPublicData & {lastMessage: MessagePublicData, unreadMessagesNumber: number})[] = [];

    for (let i = 0; i < discussions.length; i++) {
      const discussion = discussions[i];

      const lastMessage = await this.messageService.findOne({
        where: {chat: discussion},
        relations: ["attachment.files", "attachment.images", "attachment.audio", "chat", "sender"],
        order: {createdAt: "DESC"}
      });

      if (!lastMessage) continue;

      const unreadMessagesNumber = await this.messageService.count({
        where: {chat: discussion, sender: {id: Not(user.id)}},
        order: {createdAt: "DESC"}
      });

      discussionsPublicData[i] = {
        ...discussion.getDiscussionPublicData(),
        lastMessage: lastMessage.getPublicData(),
        unreadMessagesNumber
      };
    }

    return {
      discussions: discussionsPublicData
    };
  }
}