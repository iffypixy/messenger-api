"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesModule = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../auth");
const users_1 = require("../users");
const uploads_1 = require("../uploads");
const profiles_controller_1 = require("./profiles.controller");
let ProfilesModule = class ProfilesModule {
    configure(consumer) {
        consumer
            .apply(auth_1.AuthMiddleware)
            .forRoutes(profiles_controller_1.ProfilesController);
    }
};
ProfilesModule = __decorate([
    common_1.Module({
        imports: [
            auth_1.AuthModule,
            users_1.UsersModule,
            uploads_1.UploadsModule
        ],
        controllers: [profiles_controller_1.ProfilesController]
    })
], ProfilesModule);
exports.ProfilesModule = ProfilesModule;
//# sourceMappingURL=profiles.module.js.map