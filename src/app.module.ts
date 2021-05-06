import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {databaseConfig, jwtConfig, s3Config} from "@config/index";
import {UserModule, User} from "@modules/user";
import {RefreshSession, AuthModule} from "@modules/auth";
import {UploadModule, File} from "@modules/upload";
import {ProfileModule} from "@modules/profile";
import {ChatModule, GroupChat, GroupChatMember, GroupChatMessage, OneToOneChat, OneToOneChatMember, OneToOneChatMessage} from "@modules/chat";

@Module({
  imports: [
    UserModule,
    AuthModule,
    UploadModule,
    ProfileModule,
    ChatModule,
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
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
          OneToOneChat,
          OneToOneChatMessage,
          OneToOneChatMember,
          GroupChat,
          GroupChatMember,
          GroupChatMessage
        ]
      })
    })
  ]
})
export class AppModule {}
