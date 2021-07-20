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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const mime = require("mime");
const users_1 = require("../users");
const decorators_1 = require("../auth/decorators");
const guards_1 = require("../auth/guards");
const uploads_1 = require("./");
const files_1 = require("../../lib/files");
const typings_1 = require("../../lib/typings");
const services_1 = require("./services");
let UploadsController = class UploadsController {
    constructor(uploadsService, filesService) {
        this.uploadsService = uploadsService;
        this.filesService = filesService;
    }
    async upload(bufferedFile, user) {
        if (!bufferedFile)
            throw new common_1.BadRequestException("File is required");
        const { mimetype, size, originalname, buffer } = bufferedFile;
        const ext = mime.getExtension(mimetype);
        const { Location: url } = await this.uploadsService.upload(buffer, mimetype);
        const file = await this.filesService.create({
            name: originalname, user,
            size, extension: ext, url
        });
        return {
            file: file.public
        };
    }
};
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor("file", {
        limits: {
            fileSize: files_1.maxFileSize
        }
    })),
    common_1.HttpCode(201),
    common_1.Post(),
    __param(0, common_1.UploadedFile()),
    __param(1, decorators_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_1.User]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "upload", null);
UploadsController = __decorate([
    common_1.UseGuards(guards_1.IsAuthorizedGuard),
    common_1.Controller("upload"),
    __metadata("design:paramtypes", [services_1.UploadsService,
        services_1.FilesService])
], UploadsController);
exports.UploadsController = UploadsController;
//# sourceMappingURL=uploads.controller.js.map