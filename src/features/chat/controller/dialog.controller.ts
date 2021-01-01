import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import {In, Not} from "typeorm";

import {AuthGuard, GetUser} from "@features/auth";
import {User, UserService} from "@features/user";
import {FileService} from "@features/upload";
import {IMAGE_EXTENSIONS, AUDIO_EXTENSIONS} from "@lib/extensions";
import {CreateMessageDto} from "../dto";
import {DialogService, MessageService} from "../service";
import {DialogPublicData, MessagePublicData} from "../entity";

type GetDialogsResponse = (DialogPublicData | {
  lastMessage: MessagePublicData;
  unreadMessagesNumber: number;
})[];

@UseGuards(AuthGuard)
@Controller("dialogs")
export class DialogController {
  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {
  }

  @Get()
  async getDialogs(@GetUser() user: User): Promise<{dialogs: GetDialogsResponse}> {
    const dialogsPublicData: GetDialogsResponse = [];

    const dialogs = await this.dialogService.findByUserId(user.id);

    for (let i = 0; i < dialogs.length; i++) {
      const dialog = dialogs[i];

      const lastMessage = await this.messageService.findOne({
        join: {
          alias: "msg",
          leftJoinAndSelect: {
            sender: "msg.sender",
            chat: "msg.chat",
            files: "msg.attachments.files",
            images: "msg.attachments.images",
            audio: "msg.attachments.audio"
          }
        },
        where: {
          chat: dialog
        },
        order: {
          createdAt: "DESC"
        }
      });

      if (!lastMessage) continue;

      const unreadMessagesNumber = await this.messageService.count({
        chat: dialog, isRead: false,
        sender: {id: Not(user.id)}
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

  @Get(":companionId/messages")
  async getMessages(
    @Param("companionId") companionId: string,
    @GetUser() user: User,
    @Query("take", ParseIntPipe) take: number,
    @Query("skip", ParseIntPipe) skip: number
  ): Promise<{messages: MessagePublicData[]}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("User not found");

    const dialog = await this.dialogService.findOneByUsersIds([companion.id, user.id]);

    if (!dialog) throw new NotFoundException("Dialog not found");

    const messages = await this.messageService.find({
      join: {
        alias: "msg",
        leftJoinAndSelect: {
          sender: "msg.sender",
          chat: "msg.chat",
          files: "msg.attachments.files",
          images: "msg.attachments.images",
          audio: "msg.attachments.audio"
        }
      },
      where: {chat: dialog},
      order: {createdAt: "DESC"},
      take, skip
    });

    return {
      messages: messages.map(msg => msg.getPublicData()).reverse()
    };
  }

  @Post(":companionId/messages")
  @HttpCode(201)
  async createMessage(
    @GetUser() user: User,
    @Body() {attachments, text}: CreateMessageDto,
    @Param("companionId") companionId: string
  ): Promise<{message: MessagePublicData}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("Companion not found");

    let dialog = await this.dialogService.findOneByUsersIds([user.id, companion.id]);

    if (!dialog) dialog = await this.dialogService.create({members: [user, companion]});

    const {audioId, filesIds, imagesIds} = attachments || {};

    const message = await this.messageService.create({
      sender: user, chat: dialog, isRead: false, text,
      attachments: {
        audio: audioId && await this.fileService.findOne({id: audioId, user, extension: In(AUDIO_EXTENSIONS)}),
        files: filesIds && await this.fileService.find({id: In(filesIds), user}),
        images: imagesIds && await this.fileService.find({id: In(imagesIds), extension: In(IMAGE_EXTENSIONS), user})
      }
    });

    return {
      message: message.getPublicData()
    };
  }
}
