import {forwardRef, MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {AuthMiddleware, AuthModule} from "@modules/auth";
import {UploadsController} from "./uploads.controller";
import {FilesService, UploadsService} from "./services";
import {File} from "./entities";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([File])
  ],
  controllers: [UploadsController],
  providers: [UploadsService, FilesService],
  exports: [FilesService, UploadsService]
})
export class UploadsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware)
      .forRoutes(UploadsController);
  }
}
