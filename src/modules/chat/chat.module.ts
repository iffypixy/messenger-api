import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadModule} from "@modules/upload";
import {UserModule} from "@modules/user";
import {AuthMiddleware, AuthModule} from "@modules/auth";
import {
  AttachmentService,
  OneToOneChatMemberService,
  OneToOneChatMessageService,
  OneToOneChatService,
  GroupChatService,
  GroupChatMessageService,
  GroupChatMemberService,
  ChatGatewayService
} from "./services";
import {
  Attachment,
  GroupChat,
  GroupChatMember,
  GroupChatMessage,
  OneToOneChat,
  OneToOneChatMember,
  OneToOneChatMessage
} from "./entities";
import {GroupChatController, OneToOneChatController} from "./controllers";
import {ChatGateway} from "./chat.gateway";

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
    AttachmentService,
    ChatGateway,
    ChatGatewayService
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
