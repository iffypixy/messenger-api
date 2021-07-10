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
exports.GetGroupChatMessagesDto = void 0;
const class_validator_1 = require("class-validator");
const typings_1 = require("../../../../lib/typings");
class GetGroupChatMessagesDto {
}
__decorate([
    class_validator_1.IsUUID(4),
    __metadata("design:type", String)
], GetGroupChatMessagesDto.prototype, "group", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber({}, {
        message: "Skip must be type of number"
    }),
    __metadata("design:type", Number)
], GetGroupChatMessagesDto.prototype, "skip", void 0);
exports.GetGroupChatMessagesDto = GetGroupChatMessagesDto;
//# sourceMappingURL=get-group-chat-messages.dto.js.map