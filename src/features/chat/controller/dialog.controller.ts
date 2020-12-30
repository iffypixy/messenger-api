import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";

import {AuthGuard, GetUser} from "@features/auth";
import {User, UserService} from "@features/user";
import {FileService} from "@features/upload";
import {IMAGES_EXTENSIONS} from "@lib/file-extensions";
import {CreateMessageDto} from "../dto";
import {DialogService, MessageService} from "../service";
import {DialogPublicData, MessagePublicData} from "../entity";

@UseGuards(AuthGuard)
@Controller("dialogs")
export class DialogController {
  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  @Get()
  async getDialogs(
    @GetUser() user: User
  ): Promise<{
    dialogs: (DialogPublicData | {lastMessage: MessagePublicData})[];
  }> {
    const dialogsPublicData: (
      | DialogPublicData
      | {lastMessage: MessagePublicData}
    )[] = [];

    const dialogs = await this.dialogService.findByUserId(user.id);

    for (let i = 0; i < dialogs.length; i++) {
      const dialog = dialogs[i];

      const lastMessage = await this.dialogService.findLastMessageById(
        dialog.id
      );

      if (!lastMessage) continue;

      dialogsPublicData[i] = {
        ...dialog.getPublicData(user.id),
        lastMessage: lastMessage.getPublicData()
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

    const dialog = await this.dialogService.findOneByUsersIds([
      companion.id,
      user.id
    ]);

    if (!dialog) throw new NotFoundException("Dialog not found");

    const messages = await this.dialogService.findMessagesById(dialog.id, {
      skip,
      take
    });

    return {
      messages: messages.map(msg => msg.getPublicData())
    };
  }

  @Post(":companionId/messages")
  async createMessage(
    @GetUser() user: User,
    @Body()
    {attachments, text}: CreateMessageDto,
    @Param("companionId") companionId: string
  ): Promise<{message: MessagePublicData}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("Companion not found");

    const dialog = await this.dialogService
    .findOneByUsersIdsOrCreate([user, companion]);

    const {audioId, filesIds, imagesIds} = attachments || {};

    const files = filesIds && await this.fileService
    .findByIdsAndUserIdAndExtensions(filesIds, user.id);

    const images = imagesIds && await this.fileService
    .findByIdsAndUserIdAndExtensions(imagesIds, user.id, IMAGES_EXTENSIONS);

    const audio = audioId && await this.fileService
    .findOne({id: audioId, user, extension: ".mp3"});

    const message = await this.messageService.create({
      sender: user, chat: dialog, isRead: false,
      text, attachments: {audio, files, images}
    });

    return {
      message: message.getPublicData()
    };
  }
}
