import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {AuthMiddleware} from "@features/auth";
import {UserModule} from "@features/user";
import {UploadModule} from "@features/upload";
import {DialogController, MessageController} from "./controller";
import {MessageService, DialogService} from "./service";
import {Chat, Message} from "./entity";
import {DialogGateway} from "./gateway";

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
  controllers: [DialogController, MessageController],
  providers: [DialogService, MessageService, DialogGateway]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(DialogController, MessageController);
  }
}
