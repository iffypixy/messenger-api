import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { DirectMember } from "../entities";
export declare class DirectMembersService {
    private readonly repository;
    constructor(repository: Repository<DirectMember>);
    findOne(options: FindOneOptions<DirectMember>): Promise<DirectMember>;
    create(partial: DeepPartial<DirectMember>): Promise<DirectMember>;
    find(options: FindManyOptions<DirectMember>): Promise<DirectMember[]>;
    update(criteria: FindConditions<DirectMember>, partial: DeepPartial<DirectMember>): Promise<UpdateResult>;
    save(partial: DeepPartial<DirectMember>, options?: SaveOptions): Promise<DirectMember>;
}
