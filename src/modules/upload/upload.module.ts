import {forwardRef, MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {AuthMiddleware, AuthModule} from "@modules/auth";
import {UploadController} from "./upload.controller";
import {FileService, UploadService} from "./services";
import {File} from "./entities";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([File])
  ],
  controllers: [UploadController],
  providers: [UploadService, FileService],
  exports: [FileService, UploadService]
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware)
      .forRoutes(UploadController);
  }
}
