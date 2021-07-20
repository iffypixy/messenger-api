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
exports.DirectGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const upload_1 = require("../../upload");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const files_1 = require("../../../lib/files");
const websocket_1 = require("../../../lib/websocket");
const operators_1 = require("../../../lib/operators");
const services_1 = require("../services");
const direct_1 = require("../dtos/direct");
const events_1 = require("./events");
let DirectGateway = class DirectGateway {
    constructor(memberService, messageService, chatService, fileService, userService, websocketsService) {
        this.memberService = memberService;
        this.messageService = messageService;
        this.chatService = chatService;
        this.fileService = fileService;
        this.userService = userService;
        this.websocketsService = websocketsService;
    }
    async handleCreatingMessage(socket, dto) {
        const error = new websockets_1.WsException("Invalid credentials.");
        if (dto.partner === socket.user.id)
            throw error;
        const partner = await this.userService.findOne({
            where: {
                id: dto.partner
            }
        });
        if (!partner)
            throw error;
        let { chat, first, second } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (chat && (first.isBanned || second.isBanned))
            throw new websockets_1.WsException("No permission to send message to this partner.");
        if (!chat) {
            chat = await this.chatService.create({});
            first = await this.memberService.create({
                user: socket.user, chat
            });
            second = await this.memberService.create({
                user: partner, chat
            });
        }
        const parent = dto.parent && await this.messageService.findOne({
            where: {
                id: dto.parent, chat
            }
        });
        const files = dto.files && await this.fileService.find({
            where: {
                id: typeorm_1.In(dto.files),
                user: socket.user
            }
        });
        const images = dto.images && await this.fileService.find({
            where: {
                id: typeorm_1.In(dto.images),
                user: socket.user,
                extension: typeorm_1.In(files_1.extensions.images)
            }
        });
        const audio = dto.audio && await this.fileService.findOne({
            where: {
                id: dto.audio,
                user: socket.user,
                extension: typeorm_1.In(files_1.extensions.audios)
            }
        });
        const message = await this.messageService.create({
            chat, parent, audio,
            files: !audio ? files : null,
            images: !audio ? images : null,
            text: !audio ? dto.text : null,
            sender: first
        });
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.MESSAGE, {
                message: message.public,
                chat: chat.public,
                partner: first.public,
                isBanned: second.public.isBanned
            });
        });
        return {
            message: message.public
        };
    }
    async handleBanningPartner(socket, dto) {
        const { chat, first, second } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        if (second.isBanned)
            throw new websockets_1.WsException("Partner has been already banned.");
        const member = await this.memberService.save(Object.assign(Object.assign({}, second), { isBanned: true }));
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.BANNED, {
                chat: chat.public,
                partner: first.public
            });
        });
        return {
            chat: Object.assign(Object.assign({}, chat.public), { partner: member.public, isBanned: first.isBanned })
        };
    }
    async handleUnbanningPartner(socket, dto) {
        const { chat, first, second } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        if (!second.isBanned)
            throw new websockets_1.WsException("Partner has been already unbanned.");
        const member = await this.memberService.save(Object.assign(Object.assign({}, second), { isBanned: false }));
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.UNBANNED, {
                chat: chat.public,
                partner: first.public
            });
        });
        return {
            chat: Object.assign(Object.assign({}, chat.public), { partner: member.public, isBanned: first.isBanned })
        };
    }
    async handleReadingMessage(socket, dto) {
        const { chat, first } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const message = await this.messageService.findOne({
            where: {
                chat, id: dto.message,
                isRead: false,
                sender: {
                    id: typeorm_1.Not(first.id)
                }
            }
        });
        if (!message)
            throw new websockets_1.WsException("Message is not found.");
        await this.messageService.update({
            id: message.id
        }, {
            isRead: true
        });
        await this.messageService.update({
            chat,
            createdAt: operators_1.LessThanDate(message.createdAt),
            isRead: false,
            sender: {
                id: typeorm_1.Not(first.id)
            }
        }, {
            isRead: true
        });
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, dto.partner);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.MESSAGE_READ, {
                message: message.public,
                chat: chat.public,
                partner: first.public
            });
        });
        return {
            message: message.public,
            chat: chat.public
        };
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], DirectGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.CREATE_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, direct_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], DirectGateway.prototype, "handleCreatingMessage", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.BAN_PARTNER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, direct_1.BanPartnerDto]),
    __metadata("design:returntype", Promise)
], DirectGateway.prototype, "handleBanningPartner", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.UNBAN_PARTNER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, direct_1.UnbanPartnerDto]),
    __metadata("design:returntype", Promise)
], DirectGateway.prototype, "handleUnbanningPartner", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.READ_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, direct_1.ReadMessageDto]),
    __metadata("design:returntype", Promise)
], DirectGateway.prototype, "handleReadingMessage", null);
DirectGateway = __decorate([
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseFilters(websocket_1.BadRequestTransformationFilter),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [services_1.DirectMemberService,
        services_1.DirectMessageService,
        services_1.DirectService,
        upload_1.FileService,
        user_1.UserService,
        websocket_1.WebsocketService])
], DirectGateway);
exports.DirectGateway = DirectGateway;
//# sourceMappingURL=direct.gateway.js.map