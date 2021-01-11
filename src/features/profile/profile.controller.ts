import {BadRequestException, Body, Controller, Put, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as mime from "mime-types";

import {GetUser} from "@features/auth";
import {UserService, User, UserPublicData} from "@features/user";
import {UploadFile} from "@lib/types";
import {extensions} from "@lib/extensions";
import {UploadService} from "@features/upload";
import {UpdateProfileDto} from "./dto";

@Controller("profile")
export class ProfileController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService
  ) {
  }

  @UseInterceptors(FileInterceptor("avatar", {
    limits: {fileSize: 20000000}, fileFilter: (_, file, callback) => {
      if (extensions.image.map((ext) => mime.lookup(ext)).includes(file.mimetype)) return callback(null, true);

      callback(new BadRequestException("Invalid file extension"), false);
    }
  }))
  @Put("update")
  async updateProfile(
    @GetUser() user: User,
    @Body() {lastName, firstName}: UpdateProfileDto,
    @UploadedFile() {buffer, mimetype}: UploadFile
  ): Promise<{credentials: UserPublicData}> {
    const {Location: avatar} = await this.uploadService.upload(buffer, mimetype);

    const partial = {firstName, lastName, avatar};

    Object.keys(partial).forEach(key => !partial[key] && delete partial[key]);

    await this.userService.update({id: user.id}, partial);

    const updatedUser = await this.userService.findById(user.id);

    return {
      credentials: updatedUser.getPublicData()
    };
  }
}