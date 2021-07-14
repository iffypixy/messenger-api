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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typings_1 = require("../../lib/typings");
const users_service_1 = require("./users.service");
const dtos_1 = require("./dtos");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getByLoginQuery({ query }) {
        const users = await this.userService.find({
            where: {
                username: typeorm_1.ILike(query)
            }
        });
        return {
            users: users.map((user) => user.public)
        };
    }
    async getById(id) {
        const user = await this.userService.findById(id);
        if (!user)
            throw new common_1.NotFoundException("User is not found");
        return {
            user: user.public
        };
    }
};
__decorate([
    common_1.Get("search"),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.GetUsersByLoginQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getByLoginQuery", null);
__decorate([
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getById", null);
UsersController = __decorate([
    common_1.Controller("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map