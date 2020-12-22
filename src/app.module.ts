import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MulterModule} from "@nestjs/platform-express";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {databaseConfig, jwtConfig, s3Config} from "@config";
import {UserModule, User} from "@features/user";
import {RefreshSession, AuthModule} from "@features/auth";
import {ChatModule, Dialog, DialogMessage} from "@features/chat";
import {UploadModule} from "@features/upload";

@Module({
  imports: [
    UserModule,
    AuthModule,
    ChatModule,
    UploadModule,
    MulterModule.register(),
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      load: [databaseConfig, jwtConfig, s3Config],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        user: configService.get("database.user"),
        password: configService.get("database.password"),
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        database: configService.get("database.name"),
        synchronize: configService.get("database.synchronize"),
        entities: [User, RefreshSession, Dialog, DialogMessage]
      })
    })
]
})

export class AppModule {
}
