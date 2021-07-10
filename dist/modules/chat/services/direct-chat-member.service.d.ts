import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { DirectChatMember } from "../entities";
export declare class DirectChatMemberService {
    private readonly repository;
    constructor(repository: Repository<DirectChatMember>);
    findOne(options: FindOneOptions<DirectChatMember>): Promise<DirectChatMember>;
    create(partial: DeepPartial<DirectChatMember>): Promise<DirectChatMember>;
    find(options: FindManyOptions<DirectChatMember>): Promise<DirectChatMember[]>;
    update(criteria: FindConditions<DirectChatMember>, partial: DeepPartial<DirectChatMember>): Promise<UpdateResult>;
    save(partial: DeepPartial<DirectChatMember>, options?: SaveOptions): Promise<DirectChatMember>;
}
