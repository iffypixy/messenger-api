import { User } from "@modules/users";
import { FilePublicData } from "@modules/uploads";
import { BufferedFile } from "@lib/typings";
import { FilesService, UploadsService } from "./services";
export declare class UploadsController {
    private readonly uploadsService;
    private readonly filesService;
    constructor(uploadsService: UploadsService, filesService: FilesService);
    upload(bufferedFile: BufferedFile, user: User): Promise<{
        file: FilePublicData;
    }>;
}
