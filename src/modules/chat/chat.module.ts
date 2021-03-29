import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadModule} from "@modules/upload";
import {UserModule} from "@modules/user";
import {AuthMiddleware, AuthModule} from "@modules/auth";
import {AttachmentService} from "./services";
import {
  GroupChat,
  GroupChatMember,
  GroupChatMessage,
  GroupChatController,
  GroupChatService,
  GroupChatMessageService,
  GroupChatMemberService
} from "./features/group-chat";
import {
  OneToOneChat,
  OneToOneChatMember,
  OneToOneChatMessage,
  OneToOneChatController,
  OneToOneChatMemberService,
  OneToOneChatMessageService,
  OneToOneChatService
} from "./features/one-to-one-chat";
import {Attachment} from "./entities";

@Module({
  imports: [
    AuthModule,
    UploadModule,
    UserModule,
    TypeOrmModule.forFeature([
      OneToOneChat,
      GroupChat,
      OneToOneChatMember,
      OneToOneChatMessage,
      GroupChatMessage,
      GroupChatMember,
      Attachment
    ])
  ],
  providers: [
    OneToOneChatService,
    OneToOneChatMessageService,
    OneToOneChatMemberService,
    GroupChatService,
    GroupChatMemberService,
    GroupChatMessageService,
    AttachmentService
  ],
  controllers: [OneToOneChatController, GroupChatController]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(OneToOneChatController, GroupChatController);
  }
}
