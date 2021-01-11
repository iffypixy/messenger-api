import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {AuthMiddleware} from "@features/auth";
import {UserModule} from "@features/user";
import {ProfileController} from "./profile.controller";
import {UploadModule} from "@features/upload";

@Module({
  imports: [
    UserModule,
    UploadModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("jwt.secretKey")
      })
    }),
  ],
  controllers: [ProfileController]
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ProfileController);
  }
}