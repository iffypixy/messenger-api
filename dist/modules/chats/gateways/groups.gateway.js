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
exports.GroupsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("typeorm");
const uploads_1 = require("../../uploads");
const users_1 = require("../../users");
const typings_1 = require("../../../lib/typings");
const files_1 = require("../../../lib/files");
const operators_1 = require("../../../lib/operators");
const websocket_1 = require("../../../lib/websocket");
const services_1 = require("../services");
const events_1 = require("./events");
const groups_1 = require("../dtos/groups");
const minAmountOfMembers = 2;
let GroupsGateway = class GroupsGateway {
    constructor(membersService, messagesService, chatsService, filesService, usersService, websocketService) {
        this.membersService = membersService;
        this.messagesService = messagesService;
        this.chatsService = chatsService;
        this.filesService = filesService;
        this.usersService = usersService;
        this.websocketService = websocketService;
    }
    async subscribeChats(socket, dto) {
        const members = await this.membersService.find({
            where: {
                chat: {
                    id: typeorm_1.In(dto.groupsIds)
                },
                user: socket.user
            }
        });
        members.forEach(({ chat }) => {
            socket.join(chat.id);
        });
    }
    async createMessage(socket, dto) {
        const chat = await this.chatsService.findOne({
            where: {
                id: dto.groupId
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const member = await this.membersService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("Chat is not found");
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
            text: dto.text, sender: member
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
            details: chat.public,
            message: message.public,
            member: member.public
        });
        return {
            message: message.public
        };
    }
    async createChat(socket, dto) {
        const users = await this.usersService.find({
            where: {
                id: typeorm_1.In(dto.membersIds)
            }
        });
        if (users.length < minAmountOfMembers)
            throw new websockets_1.WsException("Not enough members to create a group");
        const title = dto.title || `${socket.user.username}${users.reduce((prev, current) => ` ${prev}${current.username}`, "")}`;
        const image = dto.avatarId ? await this.filesService.findOne({
            where: {
                id: dto.avatarId,
                user: socket.user,
                extension: typeorm_1.In(files_1.extensions.images)
            }
        }) : null;
        const chat = await this.chatsService.create({
            title, avatar: image && image.url
        });
        const member = await this.membersService.create({
            chat,
            role: "owner",
            user: socket.user
        });
        for (let i = 0; i < users.length; i++) {
            const user = users[0];
            const isOwn = user.id === socket.user.id;
            await this.membersService.create({
                user, chat,
                role: isOwn ? "owner" : "member"
            });
            const sockets = await this.websocketService.getSocketsByUserId(this.wss, user.id);
            sockets.forEach((socket) => socket.join(chat.id));
        }
        const message = await this.messagesService.create({
            chat, isSystem: true,
            text: `${member.user.username} has created the chat!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.CHAT_CREATED, {
            details: chat.public
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.SYSTEM_MESSAGE, {
            details: chat.public,
            message: message.public
        });
        return {
            chat: {
                details: chat.public
            }
        };
    }
    async addMember(socket, dto) {
        const chat = await this.chatsService.findOne({
            where: {
                id: dto.groupId
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const member = await this.membersService.findOne({
            where: {
                chat, role: "owner",
                user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("Not permitted to add members");
        const user = await this.usersService.findOne({
            where: {
                id: dto.memberId
            }
        });
        if (!user)
            throw new websockets_1.WsException("User is not found");
        const existed = await this.membersService.findOne({
            where: { chat, user }
        });
        if (existed)
            throw new websockets_1.WsException("User has been already a member of this chat");
        const added = await this.membersService.create({
            chat, user,
            role: "member"
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MEMBER_ADDED, {
            details: chat.public
        });
        const sockets = this.websocketService.getSocketsByUserId(this.wss, added.user.id);
        sockets.forEach((socket) => {
            socket.join(chat.id);
            socket.emit(events_1.groupChatClientEvents.ADDED, {
                details: chat.public
            });
        });
        const message = await this.messagesService.create({
            isSystem: true, chat,
            text: `${added.user.username} has joined!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.SYSTEM_MESSAGE, {
            details: chat.public,
            message: message.public
        });
    }
    async kickMember(socket, dto) {
        const chat = await this.chatsService.findOne({
            where: {
                id: dto.groupId
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const member = await this.membersService.findOne({
            where: {
                chat, role: "owner",
                user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("Not permitted to kick members");
        const user = await this.usersService.findOne({
            where: {
                id: dto.memberId
            }
        });
        if (!user)
            throw new websockets_1.WsException("User not found");
        const existed = await this.membersService.findOne({
            where: { user, chat }
        });
        if (!existed)
            throw new websockets_1.WsException("User has not been added yet");
        await this.membersService.delete({
            id: existed.id
        });
        const message = await this.messagesService.create({
            isSystem: true, chat,
            text: `${member.user.username} has been kicked!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.SYSTEM_MESSAGE, {
            details: chat.public,
            message: message.public
        });
        const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);
        sockets.forEach((socket) => {
            socket.leave(chat.id);
            socket.emit(events_1.groupChatClientEvents.KICKED, {
                details: chat.public
            });
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MEMBER_KICKED, {
            details: chat.public,
            member: member.public
        });
    }
    async leaveChat(socket, dto) {
        const chat = await this.chatsService.findOne({
            where: {
                id: dto.groupId
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const member = await this.membersService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not member of this chat");
        await this.membersService.delete({
            id: member.id
        });
        const message = await this.messagesService.create({
            chat, isSystem: true,
            text: `${member.user.username} left the chat!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.SYSTEM_MESSAGE, {
            details: chat.public,
            message: message.public
        });
        const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);
        sockets.forEach((socket) => {
            socket.leave(chat.id);
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MEMBER_LEFT, {
            details: chat.public,
            member: member.public
        });
        if (member.isOwner) {
            const candidate = await this.membersService.findOne({
                where: {
                    chat, user: {
                        id: typeorm_1.Not(member.user.id)
                    }
                },
                order: {
                    createdAt: "DESC"
                }
            });
            if (candidate) {
                const replacement = await this.membersService.save(Object.assign(Object.assign({}, candidate), { role: "owner" }));
                const sockets = this.websocketService.getSocketsByUserId(this.wss, replacement.user.id);
                sockets.forEach((socket) => {
                    socket.emit(events_1.groupChatClientEvents.OWNER_REPLACEMENT, {
                        details: chat.public,
                        member: replacement.public
                    });
                });
                const message = await this.messagesService.create({
                    chat, isSystem: true,
                    text: `${replacement.user.username} is chat owner now!`
                });
                this.wss.to(chat.id).emit(events_1.groupChatClientEvents.SYSTEM_MESSAGE, {
                    details: chat.public,
                    message: message.public
                });
            }
        }
    }
    async handleReadingMessage(socket, dto) {
        const chat = await this.chatsService.findOne({
            where: {
                id: dto.groupId
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const member = await this.membersService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not member of this chat");
        const message = await this.messagesService.findOne({
            where: {
                chat,
                id: dto.messageId,
                isRead: false,
                sender: {
                    id: typeorm_1.Not(member.id)
                }
            }
        });
        if (!message)
            throw new websockets_1.WsException("Message is not found");
        await this.messagesService.update({
            chat,
            createdAt: operators_1.LessThanOrEqualDate(message.createdAt),
            isRead: false,
            sender: {
                id: typeorm_1.Not(member.id)
            }
        }, {
            isRead: true
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE_READ, {
            details: chat.public,
            message: message.public
        });
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], GroupsGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.SUBSCRIBE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.SubscribeChatsDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "subscribeChats", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.CREATE_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "createMessage", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.CREATE_CHAT),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "createChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.ADD_MEMBER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.AddMemberDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "addMember", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.KICK_MEMBER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.KickMemberDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "kickMember", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.LEAVE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.LeaveChatDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "leaveChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.READ_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, groups_1.ReadMessageDto]),
    __metadata("design:returntype", Promise)
], GroupsGateway.prototype, "handleReadingMessage", null);
GroupsGateway = __decorate([
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseFilters(websocket_1.BadRequestTransformationFilter),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [services_1.GroupMembersService,
        services_1.GroupMessagesService,
        services_1.GroupsService,
        uploads_1.FilesService,
        users_1.UsersService,
        websocket_1.WebsocketService])
], GroupsGateway);
exports.GroupsGateway = GroupsGateway;
//# sourceMappingURL=groups.gateway.js.map