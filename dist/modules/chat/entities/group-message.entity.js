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
var GroupMessage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMessage = void 0;
const typeorm_1 = require("typeorm");
const upload_1 = require("../../upload");
const typings_1 = require("../../../lib/typings");
const group_entity_1 = require("./group.entity");
const group_member_entity_1 = require("./group-member.entity");
let GroupMessage = GroupMessage_1 = class GroupMessage {
    get public() {
        const { id, text, isRead, isEdited, chat, createdAt, isSystem, parent } = this;
        const sender = !isSystem ? this.sender.public : null;
        const audio = this.audio && this.audio.url;
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
            parent: parent && parent.public,
            chat: chat.public
        };
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], GroupMessage.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => group_member_entity_1.GroupMember, {
        cascade: true,
        nullable: true,
        eager: true
    }),
    __metadata("design:type", group_member_entity_1.GroupMember)
], GroupMessage.prototype, "sender", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        nullable: true
    }),
    __metadata("design:type", String)
], GroupMessage.prototype, "text", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], GroupMessage.prototype, "isEdited", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], GroupMessage.prototype, "isRead", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], GroupMessage.prototype, "isSystem", void 0);
__decorate([
    typeorm_1.ManyToOne(() => GroupMessage_1, {
        nullable: true,
        cascade: true
    }),
    __metadata("design:type", GroupMessage)
], GroupMessage.prototype, "parent", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToMany(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", Array)
], GroupMessage.prototype, "files", void 0);
__decorate([
    typeorm_1.JoinTable(),
    typeorm_1.ManyToMany(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", Array)
], GroupMessage.prototype, "images", void 0);
__decorate([
    typeorm_1.ManyToOne(() => upload_1.File, {
        eager: true,
        nullable: true
    }),
    __metadata("design:type", upload_1.File)
], GroupMessage.prototype, "audio", void 0);
__decorate([
    typeorm_1.ManyToOne(() => group_entity_1.Group, {
        cascade: true,
        nullable: true,
        eager: true
    }),
    __metadata("design:type", group_entity_1.Group)
], GroupMessage.prototype, "chat", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], GroupMessage.prototype, "createdAt", void 0);
GroupMessage = GroupMessage_1 = __decorate([
    typeorm_1.Entity()
], GroupMessage);
exports.GroupMessage = GroupMessage;
//# sourceMappingURL=group-message.entity.js.map