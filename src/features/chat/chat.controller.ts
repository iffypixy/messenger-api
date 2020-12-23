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
import {CreateMessageDto} from "./dto";
import {ChatService, MessageService} from "./service";
import {Chat, DialogPublicData, MessagePublicData, Message} from "./entity";

@UseGuards(AuthGuard)
@Controller("chats")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UserService
  ) {}

  @Get()
  async getDialogs(
    @GetUser() user: User
  ): Promise<{dialogs: DialogPublicData[]}> {
    const dialogsPublicData: DialogPublicData[] = [];

    const dialogs = await this.chatService.findByMemberId(user.id);

    for (let i = 0; i < dialogs.length; i++) {
      const dialog = dialogs[i];

      const latestMessage = await this.messageService.findLatestByDialogId(dialog.id);

      dialogsPublicData[i] = {
        ...dialog.getPublicData(user.id), 
        latestMessage: latestMessage.getPublicData()
      };
    }

    return {
      dialogs: dialogsPublicData
    };
  }

  @Get(":companionId")
  async getDialog(
    @Param("companionId", ParseIntPipe) companionId: number,
    @GetUser() user: User
  ): Promise<{dialog: DialogPublicData}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("User not found");

    const dialog = await this.chatService.findByMembersOrCreate([companion, user]);

    return {
      dialog: dialog.getPublicData(user.id)
    };
  }

  @Get(":companionId/messages")
  async getMessages(
    @Param("companionId", ParseIntPipe) companionId: number,
    @GetUser() user: User,
    @Query("take", ParseIntPipe) take: number,
    @Query("skip", ParseIntPipe) skip: number
  ): Promise<{messages: DialogMessagePublicData[]}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("User not found");

    const dialog = await this.chatService.findOneByMembers([companion, user]);

    if (!dialog) throw new NotFoundException("Dialog not found");

    const messages = await this.messageService.findByDialogId(dialog.id, {skip, take});

    const messagesPublicData = messages.map(message => message.getPublicData());

    return {
      messages: messagesPublicData
    };
  }

  @Post(":companionId/messages")
  async createMessage(
    @GetUser() user: User,
    @Body() {attachments: {audioId, filesIds, imagesIds}, text}: CreateMessageDto,
    @Param("companionId", ParseIntPipe) companionId: number
  ): Promise<{message: DialogMessagePublicData}> {
    const companion = await this.userService.findById(companionId);

    if (!companion) throw new NotFoundException("Companion not found");

    const dialog = await this.chatService.findByMembersOrCreate([user, companion]);

    const message = await this.messageService.create({
      sender: user, dialog, 
      text, attachments: {
        audio: audioId,
        files: filesIds,
        images: imagesIds
      }
    });

    return {
      message: message.getPublicData()
    };
  }
}
