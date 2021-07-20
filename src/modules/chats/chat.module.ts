import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadsModule} from "@modules/uploads";
import {UsersModule} from "@modules/users";
import {AuthMiddleware, AuthModule} from "@modules/auth";
import {GroupsGateway, DirectsGateway} from "./gateways";
import {DirectMembersService, DirectMessagesService, DirectsService, GroupsService, GroupMessagesService, GroupMembersService} from "./services";
import {Group, GroupMember, GroupMessage, Direct, DirectMember, DirectMessage} from "./entities";
import {DirectsController, GroupsController} from "./controllers";

@Module({
  imports: [
    AuthModule,
    UploadsModule,
    UsersModule,
    TypeOrmModule.forFeature([
      Direct,
      DirectMember,
      DirectMessage,
      Group,
      GroupMessage,
      GroupMember
    ])
  ],
  providers: [
    DirectsService,
    DirectMessagesService,
    DirectMembersService,
    GroupsService,
    GroupMembersService,
    GroupMessagesService,
    DirectsGateway,
    GroupsGateway
  ],
  controllers: [DirectsController, GroupsController]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware)
      .forRoutes(DirectsController, GroupsController);
  }
}