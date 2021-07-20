import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { DirectMember } from "../entities";
export declare class DirectMembersService {
    private readonly repository;
    constructor(repository: Repository<DirectMember>);
    findOne(options: FindOneOptions<DirectMember>): Promise<DirectMember>;
    create(partial: DeepPartial<DirectMember>): Promise<DirectMember>;
    find(options: FindManyOptions<DirectMember>): Promise<DirectMember[]>;
    update(criteria: FindConditions<DirectMember>, partial: DeepPartial<DirectMember>, { retrieve }: {
        retrieve: boolean;
    }): Promise<UpdateResult | DirectMember[]>;
}
