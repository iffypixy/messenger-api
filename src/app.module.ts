import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {databaseConfig, jwtConfig, s3Config} from "@config/index";
import {UsersModule, User} from "@modules/users";
import {RefreshSession, AuthModule} from "@modules/auth";
import {UploadsModule, File} from "@modules/uploads";
import {ProfilesModule} from "@modules/profiles";
import {ChatModule, Group, GroupMember, GroupMessage, Direct, DirectMember, DirectMessage} from "@modules/chats";
import {WebsocketModule} from "@lib/websocket";

const env = process.env.NODE_ENV;

@Module({
  imports: [
    UsersModule,
    AuthModule,
    UploadsModule,
    ProfilesModule,
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
            Direct,
            DirectMessage,
            DirectMember,
            Group,
            GroupMember,
            GroupMessage
          ]
        })
      })
  ]
})
export class AppModule {}
