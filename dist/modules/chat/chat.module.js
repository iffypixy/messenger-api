"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const upload_1 = require("../upload");
const user_1 = require("../user");
const auth_1 = require("../auth");
const gateways_1 = require("./gateways");
const services_1 = require("./services");
const entities_1 = require("./entities");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    common_1.Module({
        imports: [
            auth_1.AuthModule,
            upload_1.UploadModule,
            user_1.UserModule,
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.DirectChat,
                entities_1.DirectChatMember,
                entities_1.DirectChatMessage,
                entities_1.GroupChat,
                entities_1.GroupChatMessage,
                entities_1.GroupChatMember
            ])
        ],
        providers: [
            services_1.DirectChatService,
            services_1.DirectChatMessageService,
            services_1.DirectChatMemberService,
            services_1.GroupChatService,
            services_1.GroupChatMemberService,
            services_1.GroupChatMessageService,
            gateways_1.DirectChatGateway,
            gateways_1.GroupChatGateway
        ]
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map