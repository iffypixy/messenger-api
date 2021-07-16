"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const index_1 = require("./config");
const users_1 = require("./modules/users");
const auth_1 = require("./modules/auth");
const uploads_1 = require("./modules/uploads");
const profiles_1 = require("./modules/profiles");
const chats_1 = require("./modules/chats");
const websocket_1 = require("./lib/websocket");
const env = process.env.NODE_ENV;
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            users_1.UsersModule,
            auth_1.AuthModule,
            uploads_1.UploadsModule,
            profiles_1.ProfilesModule,
            chats_1.ChatModule,
            websocket_1.WebsocketModule,
            config_1.ConfigModule.forRoot({
                envFilePath: !!env ? `.env.${env}` : ".env.development",
                load: [index_1.databaseConfig, index_1.jwtConfig, index_1.s3Config],
                isGlobal: true
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (service) => ({
                    type: "postgres",
                    username: service.get("database.username"),
                    password: service.get("database.password"),
                    host: service.get("database.host"),
                    port: service.get("database.port"),
                    database: service.get("database.name"),
                    synchronize: service.get("database.synchronize"),
                    entities: [
                        users_1.User,
                        auth_1.RefreshSession,
                        uploads_1.File,
                        chats_1.Direct,
                        chats_1.DirectMessage,
                        chats_1.DirectMember,
                        chats_1.Group,
                        chats_1.GroupMember,
                        chats_1.GroupMessage
                    ]
                })
            })
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map