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
import {In, Not} from "typeorm";

import {GetUser} from "@features/auth";
import {User, UserService} from "@features/user";
import {ID} from "@lib/types";
import {FileService} from "@features/upload";
import {extensions} from "@lib/extensions";
import {ChatService, MessageService} from "../service";
import {DialogPublicData, MessagePublicData} from "../entity";
import {CreateMessageDto} from "../dto";

@Controller("dialogs")
export class DialogController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {
  }

  @Post(":companionId/messages")
  async createMessage(
    @GetUser() user: User,
    @Param("companionId") companionId: ID,
    @Body() {text, filesIds, imagesIds, audioId}: CreateMessageDto
  ): Promise<{message: MessagePublicData}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("User not found");

    if (companion.id === user.id) throw new BadRequestException("Invalid companion id");

    const dialogs = await this.chatService.findMany({where: {type: "dialog"}, relations: ["members"]});

    let dialog = dialogs.find(({members}) => members.map(({id}) => id).every((id) => [companion.id, user.id].includes(id)));

    if (!dialog)
      dialog = await this.chatService.createOne({members: [user, companion], type: "dialog"});

    const message = await this.messageService.createOne({
      sender: user, chat: dialog, read: false, text,
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

  @Get(":companionId/messages")
  async getMessages(
    @GetUser() user: User,
    @Param("companionId") companionId: ID,
    @Query("limit", ParseIntPipe) limit: number,
    @Query("skip", ParseIntPipe) skip: number
  ) {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("User not found");

    const dialogs = await this.chatService.findMany({where: {type: "dialog"}, relations: ["members"]});

    let dialog = dialogs.find(({members}) => members.map(({id}) => id).every((id) => [companion.id, user.id].includes(id)));

    if (!dialog) throw new NotFoundException("Dialog not found");

    const messages = await this.messageService.findMany({
        where: {chat: dialog},
        relations: ["attachment.files", "attachment.images", "attachment.audio", "chat", "sender"],
        order: {createdAt: "DESC"}
      });

    return {
      messages: messages.map((msg) => msg.getPublicData()).reverse()
    };
  }

  @Get()
  async getDialogs(
    @GetUser() user: User
  ): Promise<{dialogs: (DialogPublicData & {lastMessage: MessagePublicData, unreadMessagesNumber: number})[]}> {
    let dialogs = await this.chatService.findMany({where: {type: "dialog"}, relations: ["members"]});

    dialogs = dialogs.filter(({members}) => members.map(({id}) => id).includes(user.id));

    const dialogsPublicData:
      (DialogPublicData & {lastMessage: MessagePublicData, unreadMessagesNumber: number})[] = [];

    for (let i = 0; i < dialogs.length; i++) {
      const dialog = dialogs[i];

      const lastMessage = await this.messageService.findOne({
        where: {chat: dialog},
        relations: ["attachment.files", "attachment.images", "attachment.audio", "chat", "sender"],
        order: {createdAt: "DESC"}
      });

      if (!lastMessage) continue;

      const unreadMessagesNumber = await this.messageService.count({
        where: {chat: dialog, sender: {id: Not(user.id)}},
        order: {createdAt: "DESC"}
      });

      dialogsPublicData[i] = {
        ...dialog.getDialogPublicData(user.id),
        lastMessage: lastMessage.getPublicData(),
        unreadMessagesNumber
      };
    }

    return {
      dialogs: dialogsPublicData
    };
  }
}