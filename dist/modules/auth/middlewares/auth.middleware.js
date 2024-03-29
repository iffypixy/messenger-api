"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const users_1 = require("../../users");
const typings_1 = require("../../../lib/typings");
const services_1 = require("../services");
let AuthMiddleware = class AuthMiddleware {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async use(req, res, next) {
        const token = req.cookies["access-token"];
        const user = await this.authService.findUserByAccessToken(token);
        if (user) {
            req.user = (await this.usersService.update({ id: user.id }, { lastSeen: new Date() }, { retrieve: true }))[0];
        }
        next();
    }
};
AuthMiddleware = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [services_1.AuthService,
        users_1.UsersService])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map