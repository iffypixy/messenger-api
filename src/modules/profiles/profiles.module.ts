import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";

import {AuthModule, AuthMiddleware} from "@modules/auth";
import {UsersModule} from "@modules/users";
import {UploadsModule} from "@modules/uploads";
import {ProfilesController} from "./profiles.controller";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UploadsModule
  ],
  controllers: [ProfilesController]
})
export class ProfilesModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ProfilesController);
  }
}