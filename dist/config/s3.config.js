"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Config = void 0;
const config_1 = require("@nestjs/config");
exports.s3Config = config_1.registerAs("s3", () => ({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION
}));
//# sourceMappingURL=s3.config.js.map