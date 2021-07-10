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
var DirectChatMessage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectChatMessage = void 0;
const typeorm_1 = require("typeorm");
const typings_1 = require("../../../lib/typings");
const upload_1 = require("../../upload");
const direct_chat_entity_1 = require("./direct-chat.entity");
const direct_chat_member_entity_1 = require("./direct-chat-member.entity");
let DirectChatMessage = DirectChatMessage_1 = class DirectChatMessage {
    get public() {
        const { id, text, isRead, isEdited, createdAt, chat, isSystem, parent } = this;
        const sender = !isSystem ? this.sender.public : null;
        const audio = this.audio ? this.audio.url : null;
        const images = (this.images && !!this.images.length) ? this.images.map(({ url }) => url) : null;
        const files = (this.files && !!this.files.length) ? this.files.map((file) => file.public) : null;
        return {
            id,
            text,
            sender,
            isEdited,
            isRead,
            createdAt,
            isSystem,
            audio, images, files,
            chat: chat.public,
            parent: parent && parent.public
        };
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], DirectChatMessage.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direct_chat_member_entity_1.DirectChatMember, {
        eager: true,
        nullable: true,
        cascade: true
    }),
    __metadata("design:type", direct_chat_member_entity_1.DirectChatMember)
], DirectChatMessage.prototype, "sender", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        nullable: true
    }),
    __metadata("design:type", String)
], DirectChatMessage.prototype, "text", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectChatMessage.prototype, "isEdited", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectChatMessage.prototype, "isRead", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectChatMessage.prototype, "isSystem", void 0);
__decorate([
    typeorm_1.ManyToOne(() => DirectChatMessage_1, {
        nullable: true,
        cascade: true
    }),
    __metadata("design:type", DirectChatMessage)
], DirectChatMessage.prototype, "parent", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToMany(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", Array)
], DirectChatMessage.prototype, "files", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToMany(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", Array)
], DirectChatMessage.prototype, "images", void 0);
__decorate([
    typeorm_1.ManyToOne(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", upload_1.File)
], DirectChatMessage.prototype, "audio", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direct_chat_entity_1.DirectChat, {
        eager: true,
        nullable: false
    }),
    __metadata("design:type", direct_chat_entity_1.DirectChat)
], DirectChatMessage.prototype, "chat", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], DirectChatMessage.prototype, "createdAt", void 0);
DirectChatMessage = DirectChatMessage_1 = __decorate([
    typeorm_1.Entity()
], DirectChatMessage);
exports.DirectChatMessage = DirectChatMessage;
//# sourceMappingURL=direct-chat-message.entity.js.map