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
exports.DirectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_1 = require("../../user");
const typings_1 = require("../../../lib/typings");
const entities_1 = require("../entities");
const direct_member_service_1 = require("./direct-member.service");
let DirectService = class DirectService {
    constructor(repository, memberService, userService) {
        this.repository = repository;
        this.memberService = memberService;
        this.userService = userService;
    }
    create(partial) {
        const chat = this.repository.create(partial);
        return this.repository.save(chat);
    }
    find(options) {
        return this.repository.find(options);
    }
    async findOneByUsersIds(ids) {
        const firsts = await this.memberService.find({
            where: {
                user: {
                    id: ids[0]
                }
            }
        });
        const seconds = await this.memberService.find({
            where: {
                user: {
                    id: ids[1]
                }
            }
        });
        let first = firsts.find((first) => seconds.findIndex((second) => second.chat.id === first.chat.id) !== -1) || null;
        let second = first && seconds.find((second) => second.chat.id === first.chat.id);
        if (!first) {
            const chat = await this.create({});
            const firstUser = await this.userService.findById(ids[0]);
            first = await this.memberService.create({
                user: firstUser, chat
            });
            const secondUser = await this.userService.findById(ids[1]);
            second = await this.memberService.create({
                user: secondUser, chat
            });
        }
        return {
            first, second,
            chat: first.chat
        };
    }
};
DirectService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(entities_1.Direct)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        direct_member_service_1.DirectMemberService,
        user_1.UserService])
], DirectService);
exports.DirectService = DirectService;
//# sourceMappingURL=direct.service.js.map