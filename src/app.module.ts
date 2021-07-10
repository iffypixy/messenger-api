import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "path";

import {databaseConfig, jwtConfig, s3Config} from "@config/index";
import {UserModule, User} from "@modules/user";
import {RefreshSession, AuthModule} from "@modules/auth";
import {UploadModule, File} from "@modules/upload";
import {ProfileModule} from "@modules/profile";
import {ChatModule, GroupChat, GroupChatMember, GroupChatMessage, DirectChat, DirectChatMember, DirectChatMessage} from "@modules/chat";
import {WebsocketModule} from "@lib/websocket";

const env = process.env.NODE_ENV;

console.log(env, process.env);

@Module({
  imports: [
    UserModule,
    AuthModule,
    UploadModule,
    ProfileModule,
    ChatModule,
    WebsocketModule,
    ConfigModule.forRoot({
      envFilePath: !!env ? `.env.${env}` : ".env.development",
      load: [databaseConfig, jwtConfig, s3Config],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (service: ConfigService) => ({
          type: "postgres",
          username: service.get<string>("database.username"),
          password: service.get<string>("database.password"),
          host: service.get<string>("database.host"),
          port: service.get<number>("database.port"),
          database: service.get<string>("database.name"),
          synchronize: service.get<boolean>("database.synchronize"),
          entities: [
            User,
            RefreshSession,
            File,
            DirectChat,
            DirectChatMessage,
            DirectChatMember,
            GroupChat,
            GroupChatMember,
            GroupChatMessage
          ]
        })
      })
  ]
})
export class AppModule {}
