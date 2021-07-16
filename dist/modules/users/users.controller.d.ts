import { ID } from "@lib/typings";
import { UsersService } from "./users.service";
import { GetUsersByLoginQueryDto } from "./dtos";
import { UserPublicData } from "./entities";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getByLoginQuery({ query }: GetUsersByLoginQueryDto): Promise<{
        users: UserPublicData[];
    }>;
    getById(id: ID): Promise<{
        user: UserPublicData;
    }>;
}
