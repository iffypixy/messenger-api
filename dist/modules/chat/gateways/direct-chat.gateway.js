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
exports.DirectChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const upload_1 = require("../../upload");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const queries_1 = require("../../../lib/queries");
const files_1 = require("../../../lib/files");
const websocket_1 = require("../../../lib/websocket");
const operators_1 = require("../../../lib/operators");
const services_1 = require("../services");
const entities_1 = require("../entities");
const dtos_1 = require("./dtos");
const events_1 = require("./events");
let DirectChatGateway = class DirectChatGateway {
    constructor(memberService, messageService, chatService, fileService, userService, websocketsService) {
        this.memberService = memberService;
        this.messageService = messageService;
        this.chatService = chatService;
        this.fileService = fileService;
        this.userService = userService;
        this.websocketsService = websocketsService;
    }
    async handleGettingChats(socket) {
        const members = await this.memberService.find({
            where: {
                user: socket.user
            }
        });
        const chatsIds = members.map(({ chat }) => chat.id);
        const partners = await this.memberService.find({
            where: {
                chat: {
                    id: typeorm_1.In(chatsIds)
                },
                user: {
                    id: typeorm_1.Not(socket.user.id)
                }
            }
        });
        const messages = await this.messageService.find({
            where: {
                chat: {
                    id: typeorm_1.In(chatsIds)
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        const numbersOfUnreadMessages = [];
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const number = await this.messageService.count({
                where: {
                    chat: member.chat,
                    isRead: false,
                    sender: {
                        id: typeorm_1.Not(member.id)
                    }
                }
            });
            numbersOfUnreadMessages.push({
                chatId: member.chat.id, number
            });
        }
        return {
            chats: members.map((member) => {
                const partner = partners.find((partner) => partner.chat.id === member.chat.id);
                const lastMessage = messages.find((msg) => msg.chat.id === member.chat.id) || null;
                const { number } = numbersOfUnreadMessages.find(({ chatId }) => chatId === member.chat.id);
                if (!partner)
                    return;
                return Object.assign(Object.assign({}, member.chat.public), { partner: partner.public, lastMessage: lastMessage && lastMessage.public, isBanned: member.isBanned, numberOfUnreadMessages: number });
            }).filter(Boolean)
        };
    }
    async handleGettingMessages(socket, dto) {
        const { chat } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Invalid credentials.");
        const messages = await this.messageService.find({
            where: { chat },
            skip: +dto.skip,
            take: queries_1.queryLimit,
            order: {
                createdAt: "DESC"
            }
        });
        return {
            messages: messages
                .sort((a, b) => +a.createdAt - +b.createdAt)
                .map((message) => message.public)
        };
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
                partner: first.public
            });
        });
        return {
            message: message.public
        };
    }
    async handleGettingChat(socket, dto) {
        const { chat, first, second } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        return {
            chat: Object.assign(Object.assign({}, chat), { partner: second.public, isBanned: first.isBanned })
        };
    }
    async handleGettingImages(socket, dto) {
        const { chat } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const messages = await this.messageService.findWithAttachments("images", {
            skip: dto.skip,
            where: { chat },
            order: {
                createdAt: "DESC"
            }
        });
        return {
            images: messages.reduce((prev, current) => {
                const { id, images, createdAt } = current.public;
                return [...prev, ...images.map((url) => ({ id, url, createdAt }))];
            }, [])
        };
    }
    async handleGettingAudios(socket, dto) {
        const { chat } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const messages = await this.messageService.findWithAttachments("audio", {
            skip: dto.skip,
            where: { chat },
            order: {
                createdAt: "DESC"
            }
        });
        return {
            audios: messages.map((message) => {
                const msg = message.public;
                return {
                    id: msg.id,
                    url: msg.audio,
                    createdAt: msg.createdAt
                };
            })
        };
    }
    async handleGettingFiles(socket, dto) {
        const { chat } = await this.chatService.findOneByUsersIds([socket.user.id, dto.partner]);
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const messages = await this.messageService.findWithAttachments("files", {
            skip: dto.skip,
            where: { chat },
            order: {
                createdAt: "DESC"
            }
        });
        return {
            files: messages.reduce((prev, current) => {
                const { id, files, createdAt } = current.public;
                return [...prev, ...files.map((file) => ({ id, file, createdAt }))];
            }, [])
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
            chat: Object.assign(Object.assign({}, chat.public), { partner: entities_1.publiciseDirectChatMember(member), isBanned: first.isBanned })
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
            chat: Object.assign(Object.assign({}, chat.public), { partner: entities_1.publiciseDirectChatMember(member), isBanned: first.isBanned })
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
], DirectChatGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.GET_CHATS),
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleGettingChats", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.GET_MESSAGES),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetDirectChatMessagesDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleGettingMessages", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.CREATE_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateDirectChatMessageDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleCreatingMessage", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.GET_CHAT),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetDirectChatDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleGettingChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.GET_IMAGES),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetDirectChatAttachmentsDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleGettingImages", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.GET_AUDIOS),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetDirectChatAttachmentsDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleGettingAudios", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.GET_FILES),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetDirectChatAttachmentsDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleGettingFiles", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.BAN_PARTNER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.BanDirectChatPartnerDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleBanningPartner", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.UNBAN_PARTNER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.UnbanDirectChatPartnerDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleUnbanningPartner", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.directChatServerEvents.READ_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.ReadDirectMessageDto]),
    __metadata("design:returntype", Promise)
], DirectChatGateway.prototype, "handleReadingMessage", null);
DirectChatGateway = __decorate([
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseFilters(websocket_1.BadRequestTransformationFilter),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [services_1.DirectChatMemberService,
        services_1.DirectChatMessageService,
        services_1.DirectChatService,
        upload_1.FileService,
        user_1.UserService,
        websocket_1.WebsocketService])
], DirectChatGateway);
exports.DirectChatGateway = DirectChatGateway;
//# sourceMappingURL=direct-chat.gateway.js.map