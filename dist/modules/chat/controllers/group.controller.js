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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const auth_1 = require("../../auth");
const upload_1 = require("../../upload");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const services_1 = require("../services");
const queries_1 = require("../../../lib/queries");
const group_1 = require("../dtos/group");
let GroupController = class GroupController {
    constructor(memberService, messageService, chatService) {
        this.memberService = memberService;
        this.messageService = messageService;
        this.chatService = chatService;
    }
    async getChats(user) {
        const members = await this.memberService.find({
            where: { user }
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
        const unreads = [];
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const amount = await this.messageService.count({
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
            unreads.push({
                id: member.chat.id, amount
            });
        }
        return {
            chats: members.map((member) => {
                const lastMessage = messages.find(({ chat }) => chat.id === member.chat.id) || null;
                const { amount } = unreads.find(({ id }) => id === member.chat.id);
                return {
                    details: member.chat.public,
                    lastMessage: lastMessage && lastMessage.public,
                    member: member.public,
                    unreads: amount
                };
            })
        };
    }
    async getMessages(user, id, dto) {
        const messages = await this.messageService.find({
            where: {
                chat: { id }
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
    async getChat(user, id) {
        const chat = await this.chatService.findOne({
            where: { id }
        });
        const member = await this.memberService.findOne({
            where: { chat, user }
        });
        if (!member)
            throw new common_1.BadRequestException("Chat is not found");
        const participants = await this.memberService.count({
            where: { chat }
        });
        return {
            chat: {
                details: chat.public,
                member: member.public,
                participants
            }
        };
    }
    async getAttachedImages(user, id) {
        const member = await this.memberService.findOne({
            where: {
                chat: { id }, user
            }
        });
        if (!member)
            throw new common_1.BadRequestException("Chat is not found");
        const messages = await this.messageService.findWithAttachments("images", {
            where: {
                chat: { id }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return {
            images: messages.reduce((prev, current) => {
                const { id, images, createdAt } = current.public;
                return [
                    ...prev,
                    ...images.map((url) => ({ id, url, createdAt }))
                ];
            }, [])
        };
    }
    async getAttachedAudios(user, id) {
        const member = await this.memberService.findOne({
            where: {
                chat: { id }, user
            }
        });
        if (!member)
            throw new common_1.BadRequestException("Chat is not found");
        const messages = await this.messageService.findWithAttachments("audio", {
            where: {
                chat: { id }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return {
            audios: messages.map((message) => {
                const { id, audio: url, createdAt } = message.public;
                return { id, url, createdAt };
            })
        };
    }
    async getAttachedFiles(user, id) {
        const member = await this.memberService.findOne({
            where: {
                chat: { id }, user
            }
        });
        if (!member)
            throw new common_1.BadRequestException("Chat is not found");
        const messages = await this.messageService.findWithAttachments("files", {
            where: {
                chat: { id }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return {
            files: messages.reduce((prev, current) => {
                const { id, files, createdAt } = current.public;
                return [
                    ...prev,
                    ...files.map((file) => ({ id, file, createdAt }))
                ];
            }, [])
        };
    }
};
__decorate([
    common_1.Get(),
    __param(0, auth_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getChats", null);
__decorate([
    common_1.Get(":id/messages"),
    __param(0, auth_1.GetUser()),
    __param(1, common_1.Query("id")),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, String, group_1.GetMessagesDto]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getMessages", null);
__decorate([
    common_1.Get(":id"),
    __param(0, auth_1.GetUser()),
    __param(1, common_1.Query("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getChat", null);
__decorate([
    common_1.Get(":id/attached/images"),
    __param(0, auth_1.GetUser()),
    __param(1, common_1.Query("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getAttachedImages", null);
__decorate([
    common_1.Get(":id/attached/audios"),
    __param(0, auth_1.GetUser()),
    __param(1, common_1.Query("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getAttachedAudios", null);
__decorate([
    common_1.Get(":id/attached/files"),
    __param(0, auth_1.GetUser()),
    __param(1, common_1.Query("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getAttachedFiles", null);
GroupController = __decorate([
    common_1.Controller("groups"),
    __metadata("design:paramtypes", [services_1.GroupMemberService,
        services_1.GroupMessageService,
        services_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map