import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadModule} from "@modules/upload";
import {UserModule} from "@modules/user";
import {AuthMiddleware, AuthModule} from "@modules/auth";
import {OneToOneChatMemberService, OneToOneChatMessageService, OneToOneChatService, GroupChatService, GroupChatMessageService, GroupChatMemberService} from "./services";
import {GroupChat, GroupChatMember, GroupChatMessage, OneToOneChat, OneToOneChatMember, OneToOneChatMessage} from "./entities";
import {OneToOneChatController, GroupChatController} from "./controllers";

@Module({
  imports: [
    AuthModule,
    UploadModule,
    UserModule,
    TypeOrmModule.forFeature([
      OneToOneChat,
      OneToOneChatMember,
      OneToOneChatMessage,
      GroupChat,
      GroupChatMessage,
      GroupChatMember
    ])
  ],
  providers: [
    OneToOneChatService,
    OneToOneChatMessageService,
    OneToOneChatMemberService,
    GroupChatService,
    GroupChatMemberService,
    GroupChatMessageService
  ],
  controllers: [OneToOneChatController, GroupChatController]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(OneToOneChatController);
  }
}
