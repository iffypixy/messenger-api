import {registerAs} from "@nestjs/config";

export const s3Config = registerAs("s3", () => ({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION
}));