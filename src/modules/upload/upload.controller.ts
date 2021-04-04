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
import {GetUser, IsAuthorizedGuard} from "modules/auth";
import {FilePublicData} from "@modules/upload";
import {isExtensionValid} from "@lib/extensions";
import {BufferedFile} from "@lib/typings";
import {maxFileSize} from "@lib/constants";
import {FileService, UploadService} from "./services";

@UseGuards(IsAuthorizedGuard)
@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileService: FileService
  ) {}

  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {fileSize: maxFileSize},
      fileFilter: (_, file: BufferedFile, callback) => {
        const ext = `.${mime.getExtension(file.mimetype)}`;

        if (!isExtensionValid(ext)) {
          return callback(
            new BadRequestException("Invalid file extension"),
            false
          );
        }

        return callback(null, true);
      }
    })
  )
  @Post()
  async upload(
    @UploadedFile() bufferedFile: BufferedFile,
    @GetUser() user: User
  ): Promise<{file: FilePublicData}> {
    if (!bufferedFile) throw new BadRequestException("File is required");

    const {mimetype, size, originalname, buffer} = bufferedFile;

    const extension = `.${mime.getExtension(mimetype)}`;

    const {Location: url} = await this.uploadService.upload(buffer, mimetype);

    const file = await this.fileService.create({
      name: originalname,
      user,
      size,
      extension,
      url
    });

    return {
      file: file.public
    };
  }
}
