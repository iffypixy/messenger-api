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
exports.GroupMember = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const group_entity_1 = require("./group.entity");
let GroupMember = class GroupMember {
    get isOwner() {
        return this.role === "owner";
    }
    get isMember() {
        return this.role === "member";
    }
    get public() {
        const { user, isMember, isOwner } = this;
        return Object.assign(Object.assign({}, user.public), { isOwner, isMember });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], GroupMember.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, {
        eager: true,
        nullable: false,
        cascade: true
    }),
    __metadata("design:type", user_1.User)
], GroupMember.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => group_entity_1.Group, {
        eager: true,
        nullable: false,
        cascade: true
    }),
    __metadata("design:type", group_entity_1.Group)
], GroupMember.prototype, "chat", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        nullable: false,
        default: "member",
        enum: ["member", "owner"]
    }),
    __metadata("design:type", String)
], GroupMember.prototype, "role", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], GroupMember.prototype, "createdAt", void 0);
GroupMember = __decorate([
    typeorm_1.Entity()
], GroupMember);
exports.GroupMember = GroupMember;
//# sourceMappingURL=group-member.entity.js.map