import {Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {ConfigService} from "@nestjs/config";
import {nanoid} from "nanoid";

import {UploadFile} from "@lib/types";
import {UploadService} from "./upload.service";

@Controller("upload")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly configService: ConfigService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor("file"))
    upload(@UploadedFile() file: UploadFile): Promise<{url: string}> {
        const s3 = this.uploadService.getS3();

        return new Promise((resolve) => {
            s3.upload({
                ContentType: file.mimetype,
                Bucket: this.configService.get("s3.bucketName"),
                Key: nanoid(),
                Body: file.buffer
            }, (error, data) => {
                if (error) throw error;
    
                resolve({url: data.Location});
            }); 
        });
    }
}