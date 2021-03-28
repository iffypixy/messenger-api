import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadModule} from "@modules/upload";
import {UserModule} from "@modules/user";
import {AuthMiddleware, AuthModule} from "@modules/auth";
import {OneToOneChatController, GroupChatController} from "./controllers";
import {
  OneToOneChatService,
  OneToOneChatMessageService,
  OneToOneChatMemberService,
  GroupChatService,
  GroupChatMemberService,
  GroupChatMessageService,
  AttachmentService
} from "./services";
import {
  OneToOneChat,
  GroupChat,
  OneToOneChatMember,
  OneToOneChatMessage,
  GroupChatMessage,
  GroupChatMember,
  Attachment
} from "./entities";

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
  controllers: [OneToOneChatController, GroupChatController],
  providers: [
    OneToOneChatService,
    OneToOneChatMessageService,
    OneToOneChatMemberService,
    GroupChatService,
    GroupChatMemberService,
    GroupChatMessageService,
    AttachmentService
  ]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(OneToOneChatController, GroupChatController);
  }
}
