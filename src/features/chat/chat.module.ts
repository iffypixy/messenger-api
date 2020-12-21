import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {AuthMiddleware} from "@features/auth";
import {UserModule} from "@features/user";
import {DialogController} from "./controller";
import {DialogMessageService, DialogService} from "./service";
import {Dialog, DialogMessage} from "./entity";

@Module({
  imports: [
      UserModule,
      JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              secret: configService.get("jwt.secretKey")
          })
      }),
      TypeOrmModule.forFeature(
        [Dialog, DialogMessage]
      )
    ],
  controllers: [DialogController],
  providers: [DialogService, DialogMessageService]
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
    .apply(AuthMiddleware)
    .forRoutes(DialogController)
  }
}
