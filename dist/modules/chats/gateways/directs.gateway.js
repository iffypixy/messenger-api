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
exports.DirectsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const uploads_1 = require("../../uploads");
const users_1 = require("../../users");
const typings_1 = require("../../../lib/typings");
const files_1 = require("../../../lib/files");
const websocket_1 = require("../../../lib/websocket");
const operators_1 = require("../../../lib/operators");
const services_1 = require("../services");
const directs_1 = require("../dtos/directs");
const events_1 = require("./events");
let DirectsGateway = class DirectsGateway {
    constructor(membersService, messagesService, chatsService, filesService, usersService, websocketsService) {
        this.membersService = membersService;
        this.messagesService = messagesService;
        this.chatsService = chatsService;
        this.filesService = filesService;
        this.usersService = usersService;
        this.websocketsService = websocketsService;
    }
    async handleCreatingMessage(socket, dto) {
        if (dto.partnerId === socket.user.id)
            throw new websockets_1.WsException("Not permitted to send message to yourself");
        const partner = await this.usersService.findOne({
            where: {
                id: dto.partnerId
            }
        });
        if (!partner)
            throw new websockets_1.WsException("Partner is not found");
        let { chat, first, second } = await this.chatsService
            .findOneByUsers([socket.user, partner], { createNew: true });
        if (first.isBanned || second.isBanned)
            throw new websockets_1.WsException("Not permitted to send message to this partner");
        const parent = dto.parentId && await this.messagesService.findOne({
            where: {
                id: dto.parentId, chat
            }
        });
        const audio = dto.audioId ? await this.filesService.findOne({
            where: {
                id: dto.audioId,
                user: socket.user,
                extension: typeorm_1.In(files_1.extensions.audios)
            }
        }) : null;
        const files = (dto.filesIds && !audio) ? await this.filesService.find({
            where: {
                id: typeorm_1.In(dto.filesIds),
                user: socket.user
            }
        }) : null;
        const images = (dto.imagesIds && !audio) ? await this.filesService.find({
            where: {
                id: typeorm_1.In(dto.imagesIds),
                user: socket.user,
                extension: typeorm_1.In(files_1.extensions.images)
            }
        }) : null;
        const message = await this.messagesService.create({
            chat, parent, audio, files, images,
            text: dto.text, sender: first
        });
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.MESSAGE, {
                details: chat.public,
                message: message.public,
                partner: first.public,
                isBanned: second.public.isBanned
            });
        });
        return {
            message: message.public
        };
    }
    async handleBanningPartner(socket, dto) {
        const partner = await this.usersService.findOne({
            where: {
                id: dto.partnerId
            }
        });
        if (!partner)
            throw new websockets_1.WsException("Partner is not found");
        const { chat, first, second } = await this.chatsService
            .findOneByUsers([socket.user, partner], { createNew: false });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        if (second.isBanned)
            throw new websockets_1.WsException("Partner has been already banned");
        await this.membersService.update({ id: second.id }, { isBanned: true }, { retrieve: false });
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.BANNED, {
                details: chat.public,
                partner: first.public
            });
        });
    }
    async handleUnbanningPartner(socket, dto) {
        const partner = await this.usersService.findOne({
            where: {
                id: dto.partnerId
            }
        });
        if (!partner)
            throw new websockets_1.WsException("Partner is not found");
        const { chat, first, second } = await this.chatsService
            .findOneByUsers([socket.user, partner], { createNew: false });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        if (!second.isBanned)
            throw new websockets_1.WsException("Partner has been already unbanned");
        await this.membersService.update({ id: second.id }, { isBanned: false }, { retrieve: false });
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, second.user.id);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.UNBANNED, {
                details: chat.public,
                partner: first.public
            });
        });
    }
    async handleReadingMessage(socket, dto) {
        const partner = await this.usersService.findOne({
            where: {
                id: dto.partnerId
            }
        });
        if (!partner)
            throw new websockets_1.WsException("Partner is not found");
        const { chat, first, second } = await this.chatsService
            .findOneByUsers([socket.user, partner], { createNew: false });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const message = await this.messagesService.findOne({
            where: {
                chat,
                id: dto.messageId,
                isRead: false,
                sender: {
                    id: typeorm_1.Not(first.id)
                }
            }
        });
        if (!message)
            throw new websockets_1.WsException("Message is not found");
        await this.messagesService.update({ id: dto.messageId }, { isRead: true }, { retrieve: false });
        await this.messagesService.update({
            chat,
            createdAt: operators_1.LessThanDate(message.createdAt),
            isRead: false,
            sender: {
                id: typeorm_1.Not(first.id)
            }
        }, { isRead: true }, { retrieve: false });
        const sockets = this.websocketsService.getSocketsByUserId(this.wss, dto.partnerId);
        sockets.forEach((client) => {
            socket.to(client.id).emit(events_1.directChatClientEvents.MESSAGE_READ, {
                message: message.public,
                details: chat.public,
                partner: first.public,
                isBanned: second.isBanned
            });
        });
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], DirectsGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.CREATE_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, directs_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], DirectsGateway.prototype, "handleCreatingMessage", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.BAN_PARTNER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, directs_1.BanPartnerDto]),
    __metadata("design:returntype", Promise)
], DirectsGateway.prototype, "handleBanningPartner", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.UNBAN_PARTNER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, directs_1.UnbanPartnerDto]),
    __metadata("design:returntype", Promise)
], DirectsGateway.prototype, "handleUnbanningPartner", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.READ_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, directs_1.ReadMessageDto]),
    __metadata("design:returntype", Promise)
], DirectsGateway.prototype, "handleReadingMessage", null);
DirectsGateway = __decorate([
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseFilters(websocket_1.BadRequestTransformationFilter),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [services_1.DirectMembersService,
        services_1.DirectMessagesService,
        services_1.DirectsService,
        uploads_1.FilesService,
        users_1.UsersService,
        websocket_1.WebsocketService])
], DirectsGateway);
exports.DirectsGateway = DirectsGateway;
//# sourceMappingURL=directs.gateway.js.map