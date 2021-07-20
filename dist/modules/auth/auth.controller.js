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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jdenticon = require("jdenticon");
const uuid_1 = require("uuid");
const bcrypt = require("bcryptjs");
const upload_1 = require("../upload");
const user_1 = require("../user");
const decorators_1 = require("./decorators");
const guards_1 = require("./guards");
const dtos_1 = require("./dtos");
const services_1 = require("./services");
let AuthController = class AuthController {
    constructor(userService, jwtService, refreshSessionService, authService, uploadService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshSessionService = refreshSessionService;
        this.authService = authService;
        this.uploadService = uploadService;
    }
    async register({ username, password, fingerprint }, res) {
        const existed = await this.userService.findOne({
            where: { username }
        });
        if (existed)
            throw new common_1.BadRequestException("This login has been already used.");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const png = jdenticon.toPng(uuid_1.v4(), 300);
        const avatar = (await this.uploadService.upload(png, "image/png")).Location;
        const user = await this.userService.create({
            username, avatar,
            password: hashedPassword,
            role: "user", lastSeen: new Date()
        });
        const { accessToken, refreshToken } = await this.authService.getJWTs(user, fingerprint);
        res.cookie("access-token", accessToken, this.authService.accessTokenCookieOptions);
        res.cookie("refresh-token", refreshToken, this.authService.refreshTokenCookieOptions);
        return {
            credentials: user.public
        };
    }
    async login({ username, password, fingerprint }, res) {
        const user = await this.userService.findOne({
            where: { username }
        });
        const error = new common_1.BadRequestException("Invalid credentials.");
        if (!user)
            throw error;
        const doPasswordsMatch = await bcrypt.compare(password, user.password);
        if (!doPasswordsMatch)
            throw error;
        await this.refreshSessionService.delete({ fingerprint });
        const { accessToken, refreshToken } = await this.authService.getJWTs(user, fingerprint);
        res.cookie("access-token", accessToken, this.authService.accessTokenCookieOptions);
        res.cookie("refresh-token", refreshToken, this.authService.refreshTokenCookieOptions);
        return {
            credentials: user.public
        };
    }
    async refreshTokens({ fingerprint }, req, res) {
        const token = req.cookies["refresh-token"];
        const error = new common_1.BadRequestException("Invalid refresh token.");
        if (!token)
            throw error;
        const session = await this.refreshSessionService.findOne({
            where: { fingerprint, token }
        });
        if (!session)
            throw error;
        const isExpired = Date.now() - Number(session.expiresAt) >= 0;
        if (isExpired)
            throw error;
        await this.refreshSessionService.delete({
            id: session.id
        });
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.getJWTs(session.user, fingerprint);
        res.cookie("access-token", accessToken, this.authService.accessTokenCookieOptions);
        res.cookie("refresh-token", newRefreshToken, this.authService.refreshTokenCookieOptions);
    }
    getCredentials(user) {
        return {
            credentials: user_1.publiciseUser(user)
        };
    }
    async logout(req, res) {
        const token = req.cookies["refresh-token"];
        res.cookie("access-token", null);
        res.cookie("refresh-token", null);
        await this.refreshSessionService.delete({ token });
    }
};
__decorate([
    common_1.HttpCode(201),
    common_1.Post("register"),
    __param(0, common_1.Body()),
    __param(1, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    common_1.Post("login"),
    __param(0, common_1.Body()),
    __param(1, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.HttpCode(204),
    common_1.Post("refresh-tokens"),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __param(2, common_1.Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.RefreshTokensDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    common_1.UseGuards(guards_1.IsAuthorizedGuard),
    common_1.Get("credentials"),
    __param(0, decorators_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "getCredentials", null);
__decorate([
    common_1.UseGuards(guards_1.IsAuthorizedGuard),
    common_1.HttpCode(204),
    common_1.Post("logout"),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    common_1.Controller("auth"),
    __metadata("design:paramtypes", [user_1.UserService,
        jwt_1.JwtService,
        services_1.RefreshSessionService,
        services_1.AuthService,
        upload_1.UploadService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map