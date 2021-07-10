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
exports.publicise = exports.GroupChatMember = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const group_chat_entity_1 = require("./group-chat.entity");
const group_chat_member_roles_1 = require("../lib/group-chat-member-roles");
let GroupChatMember = class GroupChatMember {
    get isOwner() {
        return this.role === "owner";
    }
    get isMember() {
        return this.role === "member";
    }
    get public() {
        return exports.publicise(this);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], GroupChatMember.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, {
        eager: true,
        nullable: false,
        cascade: true
    }),
    __metadata("design:type", user_1.User)
], GroupChatMember.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => group_chat_entity_1.GroupChat, {
        eager: true,
        nullable: false,
        cascade: true
    }),
    __metadata("design:type", group_chat_entity_1.GroupChat)
], GroupChatMember.prototype, "chat", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        nullable: false,
        default: "member",
        enum: group_chat_member_roles_1.groupChatMemberRoles
    }),
    __metadata("design:type", String)
], GroupChatMember.prototype, "role", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], GroupChatMember.prototype, "createdAt", void 0);
GroupChatMember = __decorate([
    typeorm_1.Entity()
], GroupChatMember);
exports.GroupChatMember = GroupChatMember;
exports.publicise = (member) => (Object.assign(Object.assign({}, member.user.public), { isOwner: member.isOwner, isMember: member.isMember }));
//# sourceMappingURL=group-chat-member.entity.js.map