import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { UsersService } from "@modules/users";
import { ID } from "@lib/typings";
import { Direct, DirectMember } from "../entities";
import { DirectMembersService } from "./direct-members.service";
export declare class DirectsService {
    private readonly repository;
    private readonly memberService;
    private readonly userService;
    constructor(repository: Repository<Direct>, memberService: DirectMembersService, userService: UsersService);
    create(partial: DeepPartial<Direct>): Promise<Direct>;
    find(options: FindManyOptions<Direct>): Promise<Direct[]>;
    findOneByUsersIds(ids: ID[]): Promise<{
        first: DirectMember | null;
        second: DirectMember | null;
        chat: Direct | null;
    }>;
}
