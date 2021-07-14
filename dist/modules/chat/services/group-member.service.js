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
exports.GroupMemberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const entities_1 = require("../entities");
let GroupMemberService = class GroupMemberService {
    constructor(repository) {
        this.repository = repository;
    }
    create(options) {
        const member = this.repository.create(options);
        return this.repository.save(member);
    }
    find(options) {
        return this.repository.find(options);
    }
    findOne(options) {
        return this.repository.findOne(options);
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
    save(partial, options) {
        return this.repository.save(partial, options);
    }
};
GroupMemberService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(entities_1.GroupMember)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], GroupMemberService);
exports.GroupMemberService = GroupMemberService;
//# sourceMappingURL=group-member.service.js.map