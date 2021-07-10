import { DeepPartial, FindManyOptions, Repository } from "typeorm";
import { UserService } from "@modules/user";
import { ID } from "@lib/typings";
import { DirectChat, DirectChatMember } from "../entities";
import { DirectChatMemberService } from "./direct-chat-member.service";
export declare class DirectChatService {
    private readonly repository;
    private readonly memberService;
    private readonly userService;
    constructor(repository: Repository<DirectChat>, memberService: DirectChatMemberService, userService: UserService);
    create(partial: DeepPartial<DirectChat>): Promise<DirectChat>;
    find(options: FindManyOptions<DirectChat>): Promise<DirectChat[]>;
    findOneByUsersIds(ids: ID[]): Promise<{
        first: DirectChatMember | null;
        second: DirectChatMember | null;
        chat: DirectChat | null;
    }>;
}
