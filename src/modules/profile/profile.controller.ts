import {
  BadRequestException,
  Body,
  Controller,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import mime from "mime";

import {GetUser, IsAuthorizedGuard} from "@modules/auth";
import {UserService, User, UserPublicData} from "@modules/user";
import {UploadService} from "@modules/upload";
import {BufferedFile} from "@lib/typings";
import {isExtensionValid} from "@lib/extensions";
import {maxFileSize} from "@lib/constants";
import {cleanObject} from "@lib/functions";
import {UpdateProfileDto} from "./dtos";

@UseGuards(IsAuthorizedGuard)
@Controller("profile")
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService
  ) {}

  @UseInterceptors(
    FileInterceptor("avatar", {
      limits: {fileSize: maxFileSize},
      fileFilter: (_, file, callback) => {
        const ext = `.${mime.getExtension(file.mimetype)}`;

        if (!isExtensionValid(ext, "image")) {
          return callback(
            new BadRequestException("Invalid file extension"),
            false
          );
        }

        return callback(null, true);
      }
    })
  )
  @Put("update")
  async updateProfile(
    @GetUser() user: User,
    @Body() {login}: UpdateProfileDto,
    @UploadedFile() file: BufferedFile
  ): Promise<{credentials: UserPublicData}> {
    const avatar =
      file &&
      (await this.uploadService.upload(file.buffer, file.mimetype)).Location;

    const partial = {login, avatar};

    cleanObject(partial);

    const updated = await this.userService.save({
      id: user.id,
      ...partial
    });

    return {
      credentials: updated.public
    };
  }
}
