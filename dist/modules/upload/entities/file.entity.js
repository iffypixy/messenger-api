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
exports.File = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
let File = class File {
    get public() {
        const { id, name, size, url } = this;
        return { id, name, size, url };
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], File.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        nullable: false,
        length: 256
    }),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: "integer",
        nullable: false
    }),
    __metadata("design:type", Number)
], File.prototype, "size", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        nullable: false,
        length: 8
    }),
    __metadata("design:type", String)
], File.prototype, "extension", void 0);
__decorate([
    typeorm_1.Column({
        type: "text",
        nullable: false
    }),
    __metadata("design:type", String)
], File.prototype, "url", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, {
        cascade: true,
        eager: true,
        nullable: false
    }),
    __metadata("design:type", user_1.User)
], File.prototype, "user", void 0);
File = __decorate([
    typeorm_1.Entity()
], File);
exports.File = File;
//# sourceMappingURL=file.entity.js.map