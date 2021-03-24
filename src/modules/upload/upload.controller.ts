import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as mime from "mime";

import {User} from "@modules/user";
import {GetUser} from "modules/auth";
import {FilePublicData} from "@modules/upload";
import {FileExtension, extensions} from "@lib/extensions";
import {BufferedFile} from "@lib/typings";
import {maxFileSize} from "@lib/constants";
import {FileService, UploadService} from "./services";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileService: FileService
  ) {}

  @UseInterceptors(FileInterceptor("file", {limits: {fileSize: maxFileSize}}))
  @Post()
  async upload(
    @UploadedFile() bufferedFile: BufferedFile,
    @GetUser() user: User
  ): Promise<{file: FilePublicData}> {
    if (!bufferedFile) throw new BadRequestException("File is required");

    const {mimetype, size, originalname, buffer} = bufferedFile;

    const extension = `.${mime.getExtension(mimetype)}`;

    if (!extensions.all.includes(extension as FileExtension))
      throw new BadRequestException("Invalid file extension");

    const {Location: url} = await this.uploadService.upload(buffer, mimetype);

    const file = await this.fileService.create({
      name: originalname,
      user,
      size,
      extension: <FileExtension>extension,
      url
    });

    return {
      file: file.public
    };
  }
}
