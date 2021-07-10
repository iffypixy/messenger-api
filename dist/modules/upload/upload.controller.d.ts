import { User } from "@modules/user";
import { FilePublicData } from "@modules/upload";
import { BufferedFile } from "@lib/typings";
import { FileService, UploadService } from "./services";
export declare class UploadController {
    private readonly uploadService;
    private readonly fileService;
    constructor(uploadService: UploadService, fileService: FileService);
    upload(bufferedFile: BufferedFile, user: User): Promise<{
        file: FilePublicData;
    }>;
}
