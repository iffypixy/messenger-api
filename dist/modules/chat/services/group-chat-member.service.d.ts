import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { GroupChatMember } from "../entities";
export declare class GroupChatMemberService {
    private readonly repository;
    constructor(repository: Repository<GroupChatMember>);
    create(options: DeepPartial<GroupChatMember>): Promise<GroupChatMember>;
    find(options: FindManyOptions<GroupChatMember>): Promise<GroupChatMember[]>;
    findOne(options: FindOneOptions<GroupChatMember>): Promise<GroupChatMember>;
    count(options: FindManyOptions<GroupChatMember>): Promise<number>;
    delete(criteria: FindConditions<GroupChatMember>): Promise<DeleteResult>;
    update(criteria: FindConditions<GroupChatMember>, partial: DeepPartial<GroupChatMember>): Promise<UpdateResult>;
    save(partial: DeepPartial<GroupChatMember>, options?: SaveOptions): Promise<GroupChatMember>;
}
