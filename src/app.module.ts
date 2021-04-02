import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {databaseConfig, jwtConfig, s3Config} from "@config/index";
import {UserModule, User} from "@modules/user";
import {RefreshSession, AuthModule} from "@modules/auth";
import {
  ChatModule,
  OneToOneChat,
  GroupChat,
  OneToOneChatMember,
  OneToOneChatMessage,
  GroupChatMessage,
  GroupChatMember,
  Attachment
} from "@modules/chat";
import {UploadModule, File} from "@modules/upload";
import {ProfileModule} from "@modules/profile";
import {WebsocketsModule} from "@modules/websockets";

@Module({
  imports: [
    UserModule,
    AuthModule,
    ChatModule,
    UploadModule,
    ProfileModule,
    WebsocketsModule,
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
        username: configService.get("database.username"),
        password: configService.get("database.password"),
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        database: configService.get("database.name"),
        synchronize: configService.get("database.synchronize"),
        entities: [
          User,
          RefreshSession,
          File,
          ChatModule,
          OneToOneChat,
          GroupChat,
          OneToOneChatMember,
          OneToOneChatMessage,
          GroupChatMessage,
          GroupChatMember,
          Attachment
        ]
      })
    })
  ]
})
export class AppModule {}
