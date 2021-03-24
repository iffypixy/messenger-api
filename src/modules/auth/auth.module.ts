import {Module, NestModule, MiddlewareConsumer} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UserModule} from "@modules/user";
import {IsAuthorizedGuard} from "./guards";
import {RefreshSession} from "./entities";
import {RefreshSessionService} from "./services";
import {AuthMiddleware} from "./middlewares";
import {AuthController} from "./auth.controller";

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: {
          expiresIn: configService.get<string>("jwt.accessToken.expiresIn")
        }
      })
    }),
    TypeOrmModule.forFeature([RefreshSession])
  ],
  providers: [AuthMiddleware, RefreshSessionService, IsAuthorizedGuard],
  controllers: [AuthController],
  exports: [IsAuthorizedGuard, AuthMiddleware, JwtModule, UserModule]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes(AuthController);
  }
}
