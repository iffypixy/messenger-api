import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as mime from "mime";

import {User} from "@modules/user";
import {GetUser} from "@modules/auth/decorators";
import {IsAuthorizedGuard} from "@modules/auth/guards";
import {FilePublicData} from "@modules/upload";
import {maxFileSize} from "@lib/files";
import {BufferedFile} from "@lib/typings";
import {FileService, UploadService} from "./services";

@UseGuards(IsAuthorizedGuard)
@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileService: FileService
  ) {
  }

  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: maxFileSize
      }
    })
  )
  @HttpCode(201)
  @Post()
  async upload(
    @UploadedFile() bufferedFile: BufferedFile,
    @GetUser() user: User
  ): Promise<{file: FilePublicData}> {
    if (!bufferedFile) throw new BadRequestException("File is required");

    const {mimetype, size, originalname, buffer} = bufferedFile;

    const ext = `.${mime.getExtension(mimetype)}`;

    const {Location: url} = await this.uploadService.upload(buffer, mimetype);

    const file = await this.fileService.create({
      name: originalname, user,
      size, extension: ext, url
    });

    return {
      file: file.public
    };
  }
}
