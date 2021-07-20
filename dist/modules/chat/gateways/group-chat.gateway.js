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
exports.GroupChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("typeorm");
const upload_1 = require("../../upload");
const user_1 = require("../../user");
const queries_1 = require("../../../lib/queries");
const typings_1 = require("../../../lib/typings");
const files_1 = require("../../../lib/files");
const operators_1 = require("../../../lib/operators");
const websocket_1 = require("../../../lib/websocket");
const services_1 = require("../services");
const dtos_1 = require("./dtos");
const events_1 = require("./events");
let GroupChatGateway = class GroupChatGateway {
    constructor(memberService, messageService, chatService, fileService, userService, websocketService) {
        this.memberService = memberService;
        this.messageService = messageService;
        this.chatService = chatService;
        this.fileService = fileService;
        this.userService = userService;
        this.websocketService = websocketService;
    }
    async handleSubscribingChat(socket, dto) {
        const members = await this.memberService.find({
            where: {
                chat: {
                    id: typeorm_1.In(dto.groups)
                },
                user: socket.user
            }
        });
        members.forEach(({ chat }) => {
            socket.join(chat.id);
        });
    }
    async handleGettingChats(socket) {
        const members = await this.memberService.find({
            where: {
                user: socket.user
            }
        });
        const messages = await this.messageService.find({
            where: {
                chat: {
                    id: typeorm_1.In(members.map(({ chat }) => chat.id))
                }
            },
            take: 1,
            order: {
                createdAt: "DESC"
            }
        });
        const numbersOfMembers = [];
        const numbersOfUnreadMessages = [];
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const numberOfMembers = await this.memberService.count({
                where: {
                    chat: member.chat
                }
            });
            const numberOfUnreadMessages = await this.messageService.count({
                where: [{
                        chat: member.chat,
                        isRead: false,
                        sender: {
                            id: typeorm_1.Not(member.id)
                        }
                    }, {
                        chat: member.chat,
                        isRead: false,
                        sender: typeorm_1.IsNull()
                    }]
            });
            const chatId = member.chat.id;
            numbersOfMembers.push({ chatId, number: numberOfMembers });
            numbersOfUnreadMessages.push({ chatId, number: numberOfUnreadMessages });
        }
        return {
            chats: members.map((member) => {
                const lastMessage = messages.find((message) => message.chat.id === member.chat.id) || null;
                const { number: numberOfMembers } = numbersOfMembers.find(({ chatId }) => chatId === member.chat.id);
                const { number: numberOfUnreadMessages } = numbersOfUnreadMessages.find(({ chatId }) => chatId === member.chat.id);
                return Object.assign(Object.assign({}, member.chat.public), { lastMessage: lastMessage && lastMessage.public, member: member.public, numberOfMembers, numberOfUnreadMessages });
            })
        };
    }
    async handleGettingMessages(socket, dto) {
        const messages = await this.messageService.find({
            where: {
                chat: {
                    id: dto.group
                }
            },
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
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat.");
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
            sender: member
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
            message: message.public,
            chat: chat.public
        });
        return {
            message: message.public
        };
    }
    async handleGettingChat(socket, dto) {
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat.");
        const numberOfMembers = await this.memberService.count({
            where: { chat }
        });
        return {
            chat: Object.assign(Object.assign({}, chat.public), { member: member.public, numberOfMembers })
        };
    }
    async handleGettingImages(socket, dto) {
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat.");
        const messages = await this.messageService
            .findWithAttachments("images", {
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
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat.");
        const messages = await this.messageService
            .findWithAttachments("audio", {
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
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat.");
        const messages = await this.messageService
            .findWithAttachments("files", {
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
    async handleCreatingChat(socket, dto) {
        const users = (await this.userService.find({
            where: {
                id: typeorm_1.In(dto.members)
            }
        })).filter((user) => user.id !== socket.user.id);
        if (!users.length)
            throw new websockets_1.WsException("No valid members");
        const title = dto.title || `${socket.user.username} ${users.reduce((prev, current) => `${prev}${current.username} `, "").trim()}`;
        const avatar = dto.avatar && await this.fileService.findOne({
            where: {
                id: dto.avatar,
                user: socket.user,
                extension: typeorm_1.In(files_1.extensions.images)
            }
        });
        const chat = await this.chatService.create({
            title, avatar: avatar && avatar.url
        });
        const members = [];
        const member = await this.memberService.create({
            user: socket.user,
            chat, role: "owner"
        });
        members.push(member);
        const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);
        sockets.forEach((socket) => socket.join(chat.id));
        for (let i = 0; i < users.length; i++) {
            const user = users[0];
            const member = await this.memberService.create({
                user, chat, role: "member"
            });
            members.push(member);
            const sockets = await this.websocketService.getSocketsByUserId(this.wss, user.id);
            sockets.forEach((socket) => socket.join(chat.id));
        }
        const message = await this.messageService.create({
            chat, isSystem: true,
            text: `${member.user.username} has created the chat!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.CHAT_CREATED, {
            chat: chat.public,
            member: member.public
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
            chat: chat.public,
            message: message.public
        });
        return {
            chat: Object.assign(Object.assign({}, chat.public), { member: member.public, numberOfMembers: members.length })
        };
    }
    async handleAddingMember(socket, dto) {
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user,
                role: "owner"
            }
        });
        if (!member)
            throw new websockets_1.WsException("You do not have permission to add members.");
        const user = await this.userService.findOne({
            where: {
                id: dto.member
            }
        });
        if (!user)
            throw new websockets_1.WsException("User not found.");
        const existed = await this.memberService.findOne({
            where: {
                chat, user
            }
        });
        if (existed)
            throw new websockets_1.WsException("User has already been a member of this chat.");
        const added = await this.memberService.create({
            role: "member", chat, user
        });
        const numberOfMembers = await this.memberService.count({
            where: { chat }
        });
        const message = await this.messageService.create({
            isSystem: true, chat,
            text: `${added.user.username} has joined!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MEMBER_ADDED, {
            chat: chat.public,
            member: member.public,
            numberOfMembers
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
            chat: chat.public,
            message: message.public
        });
        const sockets = this.websocketService.getSocketsByUserId(this.wss, added.user.id);
        sockets.forEach((socket) => {
            socket.join(chat.id);
            socket.emit(events_1.groupChatClientEvents.ADDED, {
                chat: chat.public,
                member: added.public
            });
        });
        return {
            chat: Object.assign(Object.assign({}, chat.public), { member: added.public, numberOfMembers })
        };
    }
    async handleRemovingMember(socket, dto) {
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const owner = await this.memberService.findOne({
            where: {
                chat, user: socket.user,
                role: "owner"
            }
        });
        if (!owner)
            throw new websockets_1.WsException("You do not have permission to add members.");
        const user = await this.userService.findOne({
            where: {
                id: dto.member
            }
        });
        if (!user)
            throw new websockets_1.WsException("User not found.");
        const member = await this.memberService.findOne({
            where: {
                user, chat
            }
        });
        if (!member)
            throw new websockets_1.WsException("User is not a member of this chat.");
        await this.memberService.delete({
            id: member.id
        });
        const numberOfMembers = await this.memberService.count({
            where: { chat }
        });
        const message = await this.messageService.create({
            isSystem: true, chat,
            text: `${member.user.username} has been kicked!`
        });
        const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);
        sockets.forEach((socket) => {
            socket.leave(chat.id);
            socket.emit(events_1.groupChatClientEvents.KICKED, {
                chat: chat.public
            });
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MEMBER_KICKED, {
            member: member.public,
            chat: chat.public,
            numberOfMembers
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
            message: message.public,
            chat: chat.public
        });
        return {
            chat: Object.assign(Object.assign({}, chat.public), { member: member.public, numberOfMembers })
        };
    }
    async handleLeavingChat(socket, dto) {
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found.");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat.");
        await this.memberService.delete({
            id: member.id
        });
        const sockets = this.websocketService.getSocketsByUserId(this.wss, member.user.id);
        sockets.forEach((socket) => socket.leave(chat.id));
        let replacement = null;
        if (member.isOwner) {
            const candidate = await this.memberService.findOne({
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
                replacement = await this.memberService.save(Object.assign(Object.assign({}, candidate), { role: "owner" }));
            }
        }
        const numberOfMembers = await this.memberService.count({
            where: { chat }
        });
        const message = await this.messageService.create({
            chat, isSystem: true,
            text: `${member.user.username} left the chat!`
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MEMBER_LEFT, {
            chat: chat.public,
            member: member.public,
            numberOfMembers
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
            chat: chat.public,
            message: message.public
        });
        if (replacement) {
            const message = await this.messageService.create({
                chat, isSystem: true,
                text: `${replacement.user.username} is chat owner now!`
            });
            this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE, {
                chat: chat.public,
                message: message.public
            });
            const sockets = this.websocketService.getSocketsByUserId(this.wss, replacement.user.id);
            sockets.forEach((socket) => socket.emit(events_1.groupChatClientEvents.OWNER_REPLACEMENT, {
                chat: chat.public,
                member: replacement.public
            }));
        }
        return {
            chat: chat.public
        };
    }
    async handleReadingMessage(socket, dto) {
        const chat = await this.chatService.findOne({
            where: {
                id: dto.group
            }
        });
        if (!chat)
            throw new websockets_1.WsException("Chat is not found");
        const member = await this.memberService.findOne({
            where: {
                chat, user: socket.user
            }
        });
        if (!member)
            throw new websockets_1.WsException("You are not a member of this chat");
        const message = await this.messageService.findOne({
            where: {
                chat, id: dto.message,
                isRead: false,
                sender: {
                    id: typeorm_1.Not(member.id)
                }
            }
        });
        if (!message)
            throw new websockets_1.WsException("Message is not found");
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
                id: typeorm_1.Not(member.id)
            }
        }, {
            isRead: true
        });
        this.wss.to(chat.id).emit(events_1.groupChatClientEvents.MESSAGE_READ, {
            message: message.public,
            chat: chat.public
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
], GroupChatGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.SUBSCRIBE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.SubscribeGroupChatsDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleSubscribingChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.GET_CHATS),
    __param(0, websockets_1.ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleGettingChats", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.GET_MESSAGES),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetGroupChatMessagesDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleGettingMessages", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.CREATE_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateGroupChatMessageDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleCreatingMessage", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.GET_CHAT),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetGroupChatDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleGettingChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.GET_IMAGES),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetGroupChatAttachmentsDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleGettingImages", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.GET_AUDIOS),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetGroupChatAttachmentsDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleGettingAudios", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.GET_FILES),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.GetGroupChatAttachmentsDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleGettingFiles", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.CREATE_CHAT),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.CreateGroupChatDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleCreatingChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.ADD_MEMBER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.AddGroupChatMemberDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleAddingMember", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.KICK_MEMBER),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.RemoveGroupChatMemberDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleRemovingMember", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.LEAVE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.LeaveGroupChatDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleLeavingChat", null);
__decorate([
    websockets_1.SubscribeMessage(events_1.groupChatServerEvents.READ_MESSAGE),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dtos_1.ReadGroupMessageDto]),
    __metadata("design:returntype", Promise)
], GroupChatGateway.prototype, "handleReadingMessage", null);
GroupChatGateway = __decorate([
    common_1.UsePipes(common_1.ValidationPipe),
    common_1.UseFilters(websocket_1.BadRequestTransformationFilter),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [services_1.GroupChatMemberService,
        services_1.GroupChatMessageService,
        services_1.GroupChatService,
        upload_1.FileService,
        user_1.UserService,
        websocket_1.WebsocketService])
], GroupChatGateway);
exports.GroupChatGateway = GroupChatGateway;
//# sourceMappingURL=group-chat.gateway.js.map