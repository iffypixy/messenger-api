import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { ID } from "@lib/typings";
import { User } from "./entities";
export declare class UsersService {
    private readonly repository;
    constructor(repository: Repository<User>);
    create(partial: DeepPartial<User>): Promise<User>;
    findById(id: ID): Promise<User>;
    update(criteria: FindConditions<User>, partial: DeepPartial<User>, { retrieve }: {
        retrieve: boolean;
    }): Promise<UpdateResult | User[]>;
    findOne(options: FindOneOptions<User>): Promise<User>;
    find(options: FindManyOptions<User>): Promise<User[]>;
}
