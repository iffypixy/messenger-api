import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { ID } from "@lib/typings";
import { User } from "./entities";
export declare class UserService {
    private readonly repository;
    constructor(repository: Repository<User>);
    create(partial: DeepPartial<User>): Promise<User>;
    findById(id: ID): Promise<User>;
    update(criteria: FindConditions<User>, partial: DeepPartial<User>): Promise<UpdateResult>;
    findOne(options: FindOneOptions<User>): Promise<User>;
    find(options: FindManyOptions<User>): Promise<User[]>;
    save(partial: DeepPartial<User>, options?: SaveOptions): Promise<User>;
}
