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
const user_1 = require("./modules/user");
const auth_1 = require("./modules/auth");
const upload_1 = require("./modules/upload");
const profile_1 = require("./modules/profile");
const chat_1 = require("./modules/chat");
const websocket_1 = require("./lib/websocket");
const env = process.env.NODE_ENV;
console.log(env, process.env);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            user_1.UserModule,
            auth_1.AuthModule,
            upload_1.UploadModule,
            profile_1.ProfileModule,
            chat_1.ChatModule,
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
                        user_1.User,
                        auth_1.RefreshSession,
                        upload_1.File,
                        chat_1.DirectChat,
                        chat_1.DirectChatMessage,
                        chat_1.DirectChatMember,
                        chat_1.GroupChat,
                        chat_1.GroupChatMember,
                        chat_1.GroupChatMessage
                    ]
                })
            })
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map