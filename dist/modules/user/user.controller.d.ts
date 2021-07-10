import { ID } from "@lib/typings";
import { UserService } from "./user.service";
import { GetUsersByLoginQueryDto } from "./dtos";
import { UserPublicData } from "./lib/typings";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getByLoginQuery({ query }: GetUsersByLoginQueryDto): Promise<{
        users: UserPublicData[];
    }>;
    getById(id: ID): Promise<{
        user: UserPublicData;
    }>;
}
