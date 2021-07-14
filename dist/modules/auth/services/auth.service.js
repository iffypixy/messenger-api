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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const uuid_1 = require("uuid");
const config_1 = require("@nestjs/config");
const users_1 = require("../../users");
const refresh_sessions_service_1 = require("./refresh-sessions.service");
let AuthService = class AuthService {
    constructor(userService, jwtService, refreshSessionService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshSessionService = refreshSessionService;
        this.configService = configService;
    }
    async findUserByAccessToken(token) {
        try {
            const { userId } = await this.jwtService.verifyAsync(token);
            return this.userService.findById(userId);
        }
        catch (error) {
            return null;
        }
    }
    async getJWTs(user, fingerprint) {
        const refreshTokenExpiresIn = this.configService.get("jwt.refreshToken.expiresIn");
        const accessToken = await this.jwtService.signAsync({
            userId: user.id
        });
        const refreshToken = await this.refreshSessionService.create({
            user, fingerprint, token: uuid_1.v4(),
            expiresAt: new Date(Date.now() + refreshTokenExpiresIn),
        });
        return {
            accessToken,
            refreshToken: refreshToken.token
        };
    }
    get accessTokenCookieOptions() {
        return {
            httpOnly: true,
            path: "/",
            maxAge: this.configService.get("jwt.accessToken.expiresIn")
        };
    }
    get refreshTokenCookieOptions() {
        return {
            httpOnly: true,
            path: "/",
            maxAge: this.configService.get("jwt.refreshToken.expiresIn")
        };
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_1.UsersService,
        jwt_1.JwtService,
        refresh_sessions_service_1.RefreshSessionsService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map