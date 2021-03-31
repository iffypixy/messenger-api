import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {WebsocketsGateway} from "./websockets.gateway";
import {WebsocketsService} from "./websockets.service";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: {
          expiresIn: configService.get<string>("jwt.accessToken.expiresIn")
        }
      })
    })
  ],
  providers: [WebsocketsGateway, WebsocketsService],
  exports: [WebsocketsGateway, WebsocketsService]
})
export class WebsocketsModule {}
