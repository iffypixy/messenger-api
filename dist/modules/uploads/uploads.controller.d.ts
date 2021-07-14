import { User } from "@modules/users";
import { FilePublicData } from "@modules/uploads";
import { BufferedFile } from "@lib/typings";
import { FilesService, UploadsService } from "./services";
export declare class UploadsController {
    private readonly uploadService;
    private readonly filesService;
    constructor(uploadService: UploadsService, filesService: FilesService);
    upload(bufferedFile: BufferedFile, user: User): Promise<{
        file: FilePublicData;
    }>;
}
