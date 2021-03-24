import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";

import {AuthModule, AuthMiddleware} from "@modules/auth";
import {UserModule} from "@modules/user";
import {UploadModule} from "@modules/upload";
import {ProfileController} from "./profile.controller";

@Module({
  imports: [
    AuthModule,
    UserModule,
    UploadModule
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