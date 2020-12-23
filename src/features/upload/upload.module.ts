import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {AuthMiddleware} from "@features/auth";
import {UserModule} from "@features/user";
import {UploadController} from "./upload.controller";
import {FileService, UploadService} from "./services";
import {File} from "./entity";

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
          [File]
      )
  ],
  controllers: [UploadController],
  providers: [UploadService, FileService]
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(UploadController);
  }
}
