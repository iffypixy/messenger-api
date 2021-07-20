import {Module, NestModule, MiddlewareConsumer} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

import {UploadsModule} from "@modules/uploads";
import {UsersModule} from "@modules/users";
import {AuthGateway} from "./gateways";
import {IsAuthorizedGuard} from "./guards";
import {RefreshSession} from "./entities";
import {RefreshSessionsService, AuthService} from "./services";
import {AuthMiddleware} from "./middlewares";
import {AuthController} from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    UploadsModule,
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
  providers: [
    AuthMiddleware,
    RefreshSessionsService,
    AuthService,
    IsAuthorizedGuard,
    AuthGateway
  ],
  controllers: [AuthController],
  exports: [
    IsAuthorizedGuard,
    AuthMiddleware,
    JwtModule,
    UsersModule,
    AuthService
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware)
      .forRoutes(AuthController)
  }
}
