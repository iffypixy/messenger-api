import { User, UserService, UserPublicData } from "@modules/user";
import { UploadService } from "@modules/upload";
import { BufferedFile } from "@lib/typings";
import { UpdateProfileDto } from "./dtos";
export declare class ProfileController {
    private readonly userService;
    private readonly uploadService;
    constructor(userService: UserService, uploadService: UploadService);
    updateProfile(user: User, { username }: UpdateProfileDto, bufferedFile: BufferedFile): Promise<{
        credentials: UserPublicData;
    }>;
}
