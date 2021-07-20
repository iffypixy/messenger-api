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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterDto {
}
__decorate([
    class_validator_1.IsAlphanumeric("en-US", {
        message: "Username must have only letters and numbers"
    }),
    class_validator_1.Length(3, 24),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString({ message: "Password must be type of string" }),
    class_validator_1.Length(8, 50),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    class_validator_1.IsString({ message: "Fingerprint must be type of string" }),
    class_validator_1.Length(5, 150),
    __metadata("design:type", String)
], RegisterDto.prototype, "fingerprint", void 0);
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map