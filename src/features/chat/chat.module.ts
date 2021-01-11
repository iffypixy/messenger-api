import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadModule} from "@features/upload";
import {UserModule} from "@features/user";
import {AuthMiddleware} from "@features/auth";
import {DialogController, DiscussionController} from "./controller";
import {Chat, Message} from "./entity";
import {ChatService, MessageService} from "./service";

@Module({
  imports: [
    UploadModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("jwt.secretKey")
      })
    }),
    TypeOrmModule.forFeature([Chat, Message])
  ],
  controllers: [DialogController, DiscussionController],
  providers: [ChatService, MessageService]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(DialogController, DiscussionController);
  }
}