import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {AuthMiddleware} from "@features/auth";
import {UserModule} from "@features/user";
import {UploadModule} from "@features/upload";
import {DialogController} from "./controller";
import {MessageService, DialogService} from "./service";
import {Chat, Message} from "./entity";

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
  controllers: [DialogController],
  providers: [DialogService, MessageService]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(DialogController);
  }
}
