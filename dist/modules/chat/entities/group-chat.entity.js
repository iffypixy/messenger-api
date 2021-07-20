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
exports.GroupChat = void 0;
const typeorm_1 = require("typeorm");
const typings_1 = require("../../../lib/typings");
const avatar = "https://messenger-bucket.s3.eu-central-1.amazonaws.com/499b1c41-61a3-4f24-b691-65efe35ddd35.png";
let GroupChat = class GroupChat {
    get public() {
        const { id, title, avatar } = this;
        return { id, title, avatar };
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], GroupChat.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        nullable: false,
        length: 128
    }),
    __metadata("design:type", String)
], GroupChat.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        nullable: false,
        default: avatar
    }),
    __metadata("design:type", String)
], GroupChat.prototype, "avatar", void 0);
GroupChat = __decorate([
    typeorm_1.Entity()
], GroupChat);
exports.GroupChat = GroupChat;
//# sourceMappingURL=group-chat.entity.js.map