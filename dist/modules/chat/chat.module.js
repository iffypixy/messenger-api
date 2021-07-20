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
const controllers_1 = require("./controllers");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    common_1.Module({
        imports: [
            auth_1.AuthModule,
            upload_1.UploadModule,
            user_1.UserModule,
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Direct,
                entities_1.DirectMember,
                entities_1.DirectMessage,
                entities_1.Group,
                entities_1.GroupMessage,
                entities_1.GroupMember
            ])
        ],
        providers: [
            services_1.DirectService,
            services_1.DirectMessageService,
            services_1.DirectMemberService,
            services_1.GroupService,
            services_1.GroupMemberService,
            services_1.GroupMessageService,
            gateways_1.DirectGateway,
            gateways_1.GroupGateway
        ],
        controllers: [controllers_1.DirectController, controllers_1.GroupController]
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map