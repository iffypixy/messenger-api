import {Body, Controller, Post} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {nanoid} from "nanoid";

import {UploadFileDto} from "./dto/upload-file.dto";
import {UploadService} from "./upload.service";

@Controller("upload")
export class UploadController {
    constructor(
        private readonly uploadService: UploadService,
        private readonly configService: ConfigService
    ) {}

    @Post()
    async uploadFile(
        @Body() {extension}: UploadFileDto 
    ): Promise<{url: string, key: string}> {
        const s3 = this.uploadService.getS3();

        const key = nanoid();

        const url = await s3.getSignedUrlPromise("putObject", {
            ContentType: extension,
            Bucket: this.configService.get("s3.bucketName"),
            Key: key
        });

        return {url, key};
    }
}