import {BadRequestException, Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as FileType from "file-type";

import {User} from "@modules/user";
import {GetUser, IsAuthorizedGuard} from "modules/auth";
import {FilePublicData} from "@modules/upload";
import {isExtensionValid, maxFileSize} from "@lib/files";
import {BufferedFile} from "@lib/typings";
import {FileService, UploadService} from "./services";

@UseGuards(IsAuthorizedGuard)
@Controller("upload")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly fileService: FileService
  ) {}

  @UseInterceptors(
    FileInterceptor("file", {
      limits: {fileSize: maxFileSize},
      fileFilter: (_, file: BufferedFile, callback) => {
        const error = new BadRequestException("Invalid file extension");

        FileType.fromBuffer(file.buffer)
          .then(({ext}) => {
            if (!isExtensionValid(ext)) callback(error, false);

            return callback(null, true);
          })
          .catch(() => callback(error, false));
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

    const {ext} = await FileType.fromBuffer(bufferedFile.buffer);

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
