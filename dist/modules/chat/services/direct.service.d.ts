import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { UserService } from "@modules/user";
import { ID } from "@lib/typings";
import { Direct, DirectMember } from "../entities";
import { DirectMemberService } from "./direct-member.service";
export declare class DirectService {
    private readonly repository;
    private readonly memberService;
    private readonly userService;
    constructor(repository: Repository<Direct>, memberService: DirectMemberService, userService: UserService);
    create(partial: DeepPartial<Direct>): Promise<Direct>;
    find(options: FindManyOptions<Direct>): Promise<Direct[]>;
    findOneByUsersIds(ids: ID[]): Promise<{
        first: DirectMember | null;
        second: DirectMember | null;
        chat: Direct | null;
    }>;
}
