import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { User } from "@modules/users";
import { Direct, DirectMember } from "../entities";
import { DirectMembersService } from "./direct-members.service";
export declare class DirectsService {
    private readonly repository;
    private readonly membersService;
    constructor(repository: Repository<Direct>, membersService: DirectMembersService);
    create(partial: DeepPartial<Direct>): Promise<Direct>;
    find(options: FindManyOptions<Direct>): Promise<Direct[]>;
    findOneByUsers(users: User[], { createNew }: {
        createNew: boolean;
    }): Promise<{
        first: DirectMember | null;
        second: DirectMember | null;
        chat: Direct | null;
    }>;
}
