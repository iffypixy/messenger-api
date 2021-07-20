import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
export declare class UploadsService {
    private readonly configService;
    constructor(configService: ConfigService);
    private readonly s3;
    upload(buffer: Buffer, mimetype: string): Promise<S3.ManagedUpload.SendData>;
}
