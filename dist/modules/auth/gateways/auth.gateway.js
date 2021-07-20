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
exports.AuthGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const cookie = require("cookie");
const websocket_1 = require("../../../lib/websocket");
const typings_1 = require("../../../lib/typings");
const services_1 = require("../services");
let AuthGateway = class AuthGateway {
    constructor(authService) {
        this.authService = authService;
    }
    afterInit() {
        this.wss.use(async (socket, next) => {
            if (!!socket.user)
                return next(null);
            const cookies = cookie.parse(socket.request.headers.cookie);
            const token = cookies["access-token"];
            const error = new websockets_1.WsException("Invalid credentials");
            if (!token)
                return next(error);
            const user = await this.authService.findUserByAccessToken(token);
            if (!user)
                throw error;
            socket.user = user;
            next(null);
        });
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], AuthGateway.prototype, "wss", void 0);
AuthGateway = __decorate([
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseFilters(websocket_1.BadRequestTransformationFilter),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [services_1.AuthService])
], AuthGateway);
exports.AuthGateway = AuthGateway;
//# sourceMappingURL=auth.gateway.js.map