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
exports.RefreshSessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let RefreshSessionsService = class RefreshSessionsService {
    constructor(repository) {
        this.repository = repository;
    }
    create(options) {
        const session = this.repository.create(options);
        return this.repository.save(session);
    }
    delete(criteria) {
        return this.repository.delete(criteria);
    }
    findOne(options) {
        return this.repository.findOne(options);
    }
};
RefreshSessionsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(entities_1.RefreshSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RefreshSessionsService);
exports.RefreshSessionsService = RefreshSessionsService;
//# sourceMappingURL=refresh-sessions.service.js.map