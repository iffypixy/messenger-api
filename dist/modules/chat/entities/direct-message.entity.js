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
var DirectMessage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectMessage = void 0;
const typeorm_1 = require("typeorm");
const typings_1 = require("../../../lib/typings");
const upload_1 = require("../../upload");
const direct_entity_1 = require("./direct.entity");
const direct_member_entity_1 = require("./direct-member.entity");
let DirectMessage = DirectMessage_1 = class DirectMessage {
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
], DirectMessage.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direct_member_entity_1.DirectMember, {
        eager: true,
        nullable: true,
        cascade: true
    }),
    __metadata("design:type", direct_member_entity_1.DirectMember)
], DirectMessage.prototype, "sender", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        nullable: true
    }),
    __metadata("design:type", String)
], DirectMessage.prototype, "text", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectMessage.prototype, "isEdited", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectMessage.prototype, "isRead", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectMessage.prototype, "isSystem", void 0);
__decorate([
    typeorm_1.ManyToOne(() => DirectMessage_1, {
        nullable: true,
        cascade: true
    }),
    __metadata("design:type", DirectMessage)
], DirectMessage.prototype, "parent", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToMany(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", Array)
], DirectMessage.prototype, "files", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToMany(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", Array)
], DirectMessage.prototype, "images", void 0);
__decorate([
    typeorm_1.ManyToOne(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", upload_1.File)
], DirectMessage.prototype, "audio", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direct_entity_1.Direct, {
        eager: true,
        nullable: false
    }),
    __metadata("design:type", direct_entity_1.Direct)
], DirectMessage.prototype, "chat", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], DirectMessage.prototype, "createdAt", void 0);
DirectMessage = DirectMessage_1 = __decorate([
    typeorm_1.Entity()
], DirectMessage);
exports.DirectMessage = DirectMessage;
//# sourceMappingURL=direct-message.entity.js.map