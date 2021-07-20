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
exports.DirectMember = void 0;
const typeorm_1 = require("typeorm");
const users_1 = require("../../users");
const typings_1 = require("../../../lib/typings");
const direct_entity_1 = require("./direct.entity");
let DirectMember = class DirectMember {
    get public() {
        const { user, isBanned } = this;
        return Object.assign(Object.assign({}, user.public), { isBanned });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], DirectMember.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => direct_entity_1.Direct, {
        cascade: true,
        eager: true,
        nullable: false
    }),
    __metadata("design:type", direct_entity_1.Direct)
], DirectMember.prototype, "chat", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_1.User, {
        nullable: false,
        eager: true,
        cascade: true
    }),
    __metadata("design:type", users_1.User)
], DirectMember.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({
        type: "boolean",
        nullable: false,
        default: false
    }),
    __metadata("design:type", Boolean)
], DirectMember.prototype, "isBanned", void 0);
DirectMember = __decorate([
    typeorm_1.Entity()
], DirectMember);
exports.DirectMember = DirectMember;
//# sourceMappingURL=direct-member.entity.js.map