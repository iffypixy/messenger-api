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
exports.CreateMessageDto = void 0;
const class_validator_1 = require("class-validator");
const typings_1 = require("../../../../lib/typings");
class CreateMessageDto {
    constructor() {
        this.audioId = null;
        this.filesIds = [];
        this.imagesIds = [];
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.MaxLength(2048),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "text", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsUUID("4", {
        each: true,
        message: "Audio must be type of uuid"
    }),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "audioId", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsUUID("4", {
        each: true,
        message: "File must be type of uuid"
    }),
    __metadata("design:type", Array)
], CreateMessageDto.prototype, "filesIds", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsUUID("4", {
        each: true,
        message: "Image must be type of uuid"
    }),
    __metadata("design:type", Array)
], CreateMessageDto.prototype, "imagesIds", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsUUID("4", {
        message: "Parent must be type of uuid"
    }),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "parentId", void 0);
__decorate([
    class_validator_1.IsUUID(4),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "groupId", void 0);
exports.CreateMessageDto = CreateMessageDto;
//# sourceMappingURL=create-message.dto.js.map