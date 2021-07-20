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
exports.DirectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_1 = require("../../users");
const entities_1 = require("../entities");
const direct_members_service_1 = require("./direct-members.service");
let DirectsService = class DirectsService {
    constructor(repository, membersService) {
        this.repository = repository;
        this.membersService = membersService;
    }
    create(partial) {
        const chat = this.repository.create(partial);
        return this.repository.save(chat);
    }
    find(options) {
        return this.repository.find(options);
    }
    async findOneByUsers(users, { createNew }) {
        const firsts = await this.membersService.find({
            where: {
                user: users[0]
            }
        });
        const seconds = await this.membersService.find({
            where: {
                user: users[1]
            }
        });
        let first = firsts.find(({ chat }) => seconds.findIndex((second) => second.chat.id === chat.id) !== -1) || null;
        let second = first && seconds.find(({ chat }) => chat.id === first.chat.id);
        let chat = first && first.chat;
        if (!chat && createNew) {
            chat = await this.create({});
            first = await this.membersService.create({
                user: users[0], chat
            });
            second = await this.membersService.create({
                user: users[1], chat
            });
        }
        return { chat, first, second };
    }
};
DirectsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(entities_1.Direct)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        direct_members_service_1.DirectMembersService])
], DirectsService);
exports.DirectsService = DirectsService;
//# sourceMappingURL=directs.service.js.map