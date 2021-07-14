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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const mime = require("mime");
const auth_1 = require("../auth");
const user_1 = require("../user");
const upload_1 = require("../upload");
const typings_1 = require("../../lib/typings");
const files_1 = require("../../lib/files");
const utils_1 = require("../../lib/utils");
const dtos_1 = require("./dtos");
let ProfileController = class ProfileController {
    constructor(userService, uploadService) {
        this.userService = userService;
        this.uploadService = uploadService;
    }
    async updateProfile(user, { username }, bufferedFile) {
        if (!bufferedFile)
            throw new common_1.BadRequestException("File is required");
        const avatar = (await this.uploadService.upload(bufferedFile.buffer, bufferedFile.mimetype)).Location;
        const partial = { username, avatar };
        utils_1.clearObject(partial);
        const updated = await this.userService.save(Object.assign(Object.assign({}, user), partial));
        return {
            credentials: updated.public
        };
    }
};
__decorate([
    common_1.UseInterceptors(platform_express_1.FileInterceptor("avatar", {
        limits: { fileSize: files_1.maxFileSize },
        fileFilter: (_, file, callback) => {
            const error = new common_1.BadRequestException("Invalid file extension");
            const ext = `.${mime.getExtension(file.mimetype)}`;
            if (!files_1.isImageExt(ext))
                return callback(error, false);
            callback(null, true);
        }
    })),
    common_1.Put("update"),
    __param(0, auth_1.GetUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User,
        dtos_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updateProfile", null);
ProfileController = __decorate([
    common_1.UseGuards(auth_1.IsAuthorizedGuard),
    common_1.Controller("profile"),
    __metadata("design:paramtypes", [user_1.UserService,
        upload_1.UploadService])
], ProfileController);
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map