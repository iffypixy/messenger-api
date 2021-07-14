import {BadRequestException, Body, Controller, Put, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as mime from "mime";

import {GetUser, IsAuthorizedGuard} from "@modules/auth";
import {User, UsersService, UserPublicData} from "@modules/users";
import {UploadsService} from "@modules/uploads";
import {BufferedFile} from "@lib/typings";
import {isImageExt, maxFileSize} from "@lib/files";
import {clearObject} from "@lib/utils";
import {UpdateProfileDto} from "./dtos";

@UseGuards(IsAuthorizedGuard)
@Controller("profile")
export class ProfilesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService
  ) {}

  @UseInterceptors(
    FileInterceptor("avatar", {
      limits: {fileSize: maxFileSize},
      fileFilter: (_, file: BufferedFile, callback) => {
        const error = new BadRequestException("Invalid file extension");

        const ext = `.${mime.getExtension(file.mimetype)}`;

        if (!isImageExt(ext)) return callback(error, false);

        callback(null, true);
      }
    })
  )
  @Put("update")
  async updateProfile(
    @GetUser() user: User,
    @Body() {username}: UpdateProfileDto,
    @UploadedFile() bufferedFile: BufferedFile
  ): Promise<{credentials: UserPublicData}> {
    if (!bufferedFile) throw new BadRequestException("File is required");

    const avatar = (await this.uploadsService.upload(bufferedFile.buffer, bufferedFile.mimetype)).Location;

    const partial = {username, avatar};

    clearObject(partial);

    const updated = await this.usersService.save({
      ...user, ...partial
    });

    return {
      credentials: updated.public
    };
  }
}
