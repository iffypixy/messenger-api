import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {S3} from "aws-sdk";

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  getS3(): S3 {
    return new S3({
      accessKeyId: this.configService.get("s3.accessKeyId"),
      secretAccessKey: this.configService.get("s3.secretAccessKey"),
      region: this.configService.get("s3.region")
    });
  }
}
