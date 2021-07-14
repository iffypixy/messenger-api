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
const uploads_1 = require("../uploads");
const users_1 = require("../users");
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
            uploads_1.UploadsModule,
            users_1.UsersModule,
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
            services_1.DirectsService,
            services_1.DirectMessagesService,
            services_1.DirectMembersService,
            services_1.GroupsService,
            services_1.GroupMembersService,
            services_1.GroupMessagesService,
            gateways_1.DirectsGateway,
            gateways_1.GroupsGateway
        ],
        controllers: [controllers_1.DirectsController, controllers_1.GroupsController]
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map