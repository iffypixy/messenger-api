import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { GroupMember } from "../entities";
export declare class GroupMembersService {
    private readonly repository;
    constructor(repository: Repository<GroupMember>);
    create(options: DeepPartial<GroupMember>): Promise<GroupMember>;
    find(options: FindManyOptions<GroupMember>): Promise<GroupMember[]>;
    findOne(options: FindOneOptions<GroupMember>): Promise<GroupMember>;
    count(options: FindManyOptions<GroupMember>): Promise<number>;
    delete(criteria: FindConditions<GroupMember>): Promise<DeleteResult>;
    update(criteria: FindConditions<GroupMember>, partial: DeepPartial<GroupMember>): Promise<UpdateResult>;
    save(partial: DeepPartial<GroupMember>, options?: SaveOptions): Promise<GroupMember>;
}
