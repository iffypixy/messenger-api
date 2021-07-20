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
exports.CreateChatDto = void 0;
const class_validator_1 = require("class-validator");
const typings_1 = require("../../../../lib/typings");
class CreateChatDto {
}
__decorate([
    class_validator_1.IsUUID(4, {
        each: true
    }),
    __metadata("design:type", Array)
], CreateChatDto.prototype, "members", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString({
        message: "Title must be type of string"
    }),
    __metadata("design:type", String)
], CreateChatDto.prototype, "title", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsUUID(4),
    __metadata("design:type", String)
], CreateChatDto.prototype, "avatar", void 0);
exports.CreateChatDto = CreateChatDto;
//# sourceMappingURL=create-chat.dto.js.map