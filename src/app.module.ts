import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {databaseConfig, jwtConfig, s3Config} from "@config";
import {UserModule, User} from "@features/user";
import {RefreshSession, AuthModule} from "@features/auth";
import {ChatModule, Chat, Message} from "@features/chat";
import {UploadModule, File} from "@features/upload";
import {ProfileModule} from "@features/profile";

@Module({
  imports: [
    UserModule,
    AuthModule,
    ChatModule,
    UploadModule,
    ProfileModule,
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
        entities: [User, RefreshSession, Chat, Message, File]
      })
    })
]
})

export class AppModule {
}
