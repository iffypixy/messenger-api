"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const uploads_1 = require("../uploads");
const users_1 = require("../users");
const gateways_1 = require("./gateways");
const guards_1 = require("./guards");
const entities_1 = require("./entities");
const services_1 = require("./services");
const middlewares_1 = require("./middlewares");
const auth_controller_1 = require("./auth.controller");
let AuthModule = class AuthModule {
    configure(consumer) {
        consumer.apply(middlewares_1.AuthMiddleware)
            .forRoutes(auth_controller_1.AuthController);
    }
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            users_1.UsersModule,
            uploads_1.UploadsModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get("jwt.secret"),
                    signOptions: {
                        expiresIn: configService.get("jwt.accessToken.expiresIn")
                    }
                })
            }),
            typeorm_1.TypeOrmModule.forFeature([entities_1.RefreshSession])
        ],
        providers: [
            middlewares_1.AuthMiddleware,
            services_1.RefreshSessionsService,
            services_1.AuthService,
            guards_1.IsAuthorizedGuard,
            gateways_1.AuthGateway
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [
            guards_1.IsAuthorizedGuard,
            middlewares_1.AuthMiddleware,
            jwt_1.JwtModule,
            users_1.UsersModule,
            services_1.AuthService
        ]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map