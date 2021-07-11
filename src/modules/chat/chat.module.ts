import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadModule} from "@modules/upload";
import {UserModule} from "@modules/user";
import {AuthModule} from "@modules/auth";
import {GroupChatGateway, DirectChatGateway} from "./gateways";
import {DirectChatMemberService, DirectChatMessageService, DirectChatService, GroupChatService, GroupChatMessageService, GroupChatMemberService} from "./services";
import {GroupChat, GroupChatMember, GroupChatMessage, DirectChat, DirectChatMember, DirectChatMessage} from "./entities";

@Module({
  imports: [
    AuthModule,
    UploadModule,
    UserModule,
    TypeOrmModule.forFeature([
      DirectChat,
      DirectChatMember,
      DirectChatMessage,
      GroupChat,
      GroupChatMessage,
      GroupChatMember
    ])
  ],
  providers: [
    DirectChatService,
    DirectChatMessageService,
    DirectChatMemberService,
    GroupChatService,
    GroupChatMemberService,
    GroupChatMessageService,
    DirectChatGateway,
    GroupChatGateway
  ]
})
export class ChatModule {
}