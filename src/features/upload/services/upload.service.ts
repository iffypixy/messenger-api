import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {S3} from "aws-sdk";
import {nanoid} from "nanoid";
import * as path from "path";

import {UploadFile} from "@lib/types";
import {FileService} from "./file.service";
@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService
  ) {}

  getS3(): S3 {
    return new S3({
      accessKeyId: this.configService.get("s3.accessKeyId"),
      secretAccessKey: this.configService.get("s3.secretAccessKey"),
      region: this.configService.get("s3.region")
    });
  }

  upload(buffer: Buffer, mimetype: string): Promise<S3.ManagedUpload.SendData> {
    const s3 = this.getS3();

    return new Promise(resolve => {
      s3.upload(
        {
          ContentType: mimetype,
          Bucket: this.configService.get("s3.bucketName"),
          Key: nanoid(),
          Body: buffer
        },
        (error, data) => {
          if (error) throw error;

          resolve(data);
        }
      );
    });
  }
}
