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
exports.DirectMessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let DirectMessageService = class DirectMessageService {
    constructor(repository) {
        this.repository = repository;
    }
    find(options) {
        return this.repository.find(options);
    }
    findOne(options) {
        return this.repository.findOne(options);
    }
    create(partial) {
        const message = this.repository.create(partial);
        return this.repository.save(message);
    }
    count(options) {
        return this.repository.count(options);
    }
    delete(criteria) {
        return this.repository.delete(criteria);
    }
    update(criteria, partial) {
        return this.repository.update(criteria, partial);
    }
    findAndCount(options) {
        return this.repository.findAndCount(options);
    }
    save(partial, options) {
        return this.repository.save(partial, options);
    }
    findWithAttachments(attachment, options) {
        for (const key in options.order) {
            options.order = {
                [`message.${key}`]: options.order[key]
            };
        }
        return this.repository.createQueryBuilder("message")
            .leftJoinAndSelect("message.chats", "chat")
            .leftJoinAndSelect("message.sender", "sender")
            .leftJoinAndSelect("sender.users", "user")
            .leftJoinAndSelect("message.files", "files")
            .leftJoinAndSelect("message.audio", "audio")
            .leftJoinAndSelect("message.images", "images")
            .leftJoinAndSelect("message.parent", "parent")
            .where(options.where)
            .andWhere(`${attachment} is not null`)
            .orderBy(options.order)
            .skip(options.skip)
            .take(options.take)
            .getMany();
    }
};
DirectMessageService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(entities_1.DirectMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DirectMessageService);
exports.DirectMessageService = DirectMessageService;
//# sourceMappingURL=direct-message.service.js.map