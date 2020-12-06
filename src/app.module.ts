import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {databaseConfig} from "@config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env.development"],
      load: [databaseConfig],
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
        entities: ["dist/**/*.entity{.ts,.js}"],
        synchronize: configService.get("database.synchronize")
      })
    })
  ]
})
export class AppModule {
}
