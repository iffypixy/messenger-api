import {Controller, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";
import {nanoid} from "nanoid";
import * as mime from "mime-types";
import * as path from "path";

import {UploadFile} from "@lib/types";
import {GetUser} from "@features/auth";
import {User} from "@features/user";
import {FileService, UploadService} from "./services";
import {FilePublicData} from "./entity";

@Controller("upload")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly fileService: FileService,
        private readonly configService: ConfigService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor("file", {limits: {fileSize: 20000000}}))
    upload(
        @GetUser() user: User,
        @UploadedFile() file: UploadFile
    ): Promise<{file: FilePublicData}> {
        const s3 = this.uploadService.getS3();

        return new Promise((resolve) => {
            s3.upload({
                ContentType: file.mimetype,
                Bucket: this.configService.get("s3.bucketName"),
                Key: nanoid(),
                Body: file.buffer
            }, (error, data) => {
                if (error) throw error;        

                this.fileService.create({
                    name: file.originalname, 
                    size: file.size, 
                    extension: path.extname(file.originalname),
                    url: data.Location, 
                    user
                }).then((file) => {
                    resolve({file: file.getPublicData()});
                })
            }); 
        });
    }
}