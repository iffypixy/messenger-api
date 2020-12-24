import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UserModule} from "@features/user";
import {UploadModule } from "@features/upload";
import {RefreshSession} from "./entity";
import {AuthGuard} from "./guard";
import {RefreshSessionService, AuthService} from "./service";
import {AuthMiddleware} from "./middleware";
import {AuthController} from "./auth.controller";

@Module({
  imports: [
    UserModule,
    UploadModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("jwt.secretKey"),
        signOptions: {
          expiresIn: configService.get<string>("jwt.accessToken.expiresIn")
        }
      })
    }),
    TypeOrmModule.forFeature([RefreshSession])
  ],
  controllers: [AuthController],
  providers: [RefreshSessionService, AuthService, AuthGuard]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: "auth/credentials", method: RequestMethod.GET});
  }
}
