import {Controller, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as path from "path";

import {UploadFile} from "@lib/types";
import {User} from "@features/user";
import {GetUser} from "@features/auth/decorator";
import {FileService, UploadService} from "./services";
import {FilePublicData} from "./entity";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileService: FileService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file", {limits: {fileSize: 20000000}}))
  async upload(
    @UploadedFile() {buffer, mimetype, originalname, size}: UploadFile,
    @GetUser() user: User,
  ): Promise<{file: FilePublicData}> {
    const {Location: url} = await this.uploadService.upload(buffer, mimetype);

    const file = await this.fileService.create({
      name: originalname,
      extension: path.extname(originalname),
      url, user, size
    });

    return {
      file: file.getPublicData()
    };
  }
}
