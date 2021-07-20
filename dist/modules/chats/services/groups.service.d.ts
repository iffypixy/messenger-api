import { DeepPartial, FindConditions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { Group } from "../entities";
export declare class GroupsService {
    private readonly repository;
    constructor(repository: Repository<Group>);
    create(partial: DeepPartial<Group>): Promise<Group>;
    findOne(options: FindOneOptions<Group>): Promise<Group>;
    update(criteria: FindConditions<Group>, partial: DeepPartial<Group>, { retrieve }: {
        retrieve: boolean;
    }): Promise<UpdateResult | Group[]>;
}
