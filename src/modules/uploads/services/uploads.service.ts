import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {S3} from "aws-sdk";
import {v4} from "uuid";

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get("s3.accessKeyId"),
      secretAccessKey: this.configService.get("s3.secretAccessKey"),
      region: this.configService.get("s3.region")
    });
  }

  private readonly s3: S3;

  upload(buffer: Buffer, mimetype: string): Promise<S3.ManagedUpload.SendData> {
    return new Promise(resolve => {
      this.s3.upload(
        {
          ContentType: mimetype,
          Bucket: this.configService.get("s3.bucketName"),
          Key: v4(),
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
