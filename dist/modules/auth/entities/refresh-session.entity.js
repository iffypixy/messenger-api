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
exports.RefreshSession = void 0;
const typeorm_1 = require("typeorm");
const users_1 = require("../../users");
const typings_1 = require("../../../lib/typings");
let RefreshSession = class RefreshSession {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], RefreshSession.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_1.User, {
        nullable: false,
        eager: true,
        cascade: true
    }),
    __metadata("design:type", users_1.User)
], RefreshSession.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        nullable: false,
        length: 256
    }),
    __metadata("design:type", String)
], RefreshSession.prototype, "fingerprint", void 0);
__decorate([
    typeorm_1.Column({
        type: "uuid",
        nullable: false
    }),
    __metadata("design:type", String)
], RefreshSession.prototype, "token", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp",
        nullable: false
    }),
    __metadata("design:type", Date)
], RefreshSession.prototype, "expiresAt", void 0);
RefreshSession = __decorate([
    typeorm_1.Entity()
], RefreshSession);
exports.RefreshSession = RefreshSession;
//# sourceMappingURL=refresh-session.entity.js.map