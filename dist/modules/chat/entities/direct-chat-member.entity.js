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
exports.publicise = exports.DirectChatMember = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const direct_chat_entity_1 = require("./direct-chat.entity");
let DirectChatMember = class DirectChatMember {
    get public() {
        return exports.publicise(this);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], DirectChatMember.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direct_chat_entity_1.DirectChat, {
        cascade: true,
        eager: true,
        nullable: false
    }),
    __metadata("design:type", direct_chat_entity_1.DirectChat)
], DirectChatMember.prototype, "chat", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, {
        nullable: false,
        eager: true,
        cascade: true
    }),
    __metadata("design:type", user_1.User)
], DirectChatMember.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectChatMember.prototype, "isBanned", void 0);
DirectChatMember = __decorate([
    typeorm_1.Entity()
], DirectChatMember);
exports.DirectChatMember = DirectChatMember;
exports.publicise = (member) => (Object.assign(Object.assign({}, member.user.public), { isBanned: member.isBanned }));
//# sourceMappingURL=direct-chat-member.entity.js.map