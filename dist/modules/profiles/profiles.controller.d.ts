import { User, UsersService, UserPublicData } from "@modules/users";
import { UploadsService } from "@modules/uploads";
import { BufferedFile } from "@lib/typings";
import { UpdateProfileDto } from "./dtos";
export declare class ProfilesController {
    private readonly usersService;
    private readonly uploadsService;
    constructor(usersService: UsersService, uploadsService: UploadsService);
    updateProfile(user: User, { username }: UpdateProfileDto, bufferedFile: BufferedFile): Promise<{
        credentials: UserPublicData;
    }>;
}
