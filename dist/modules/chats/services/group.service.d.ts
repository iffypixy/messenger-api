import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { Group } from "../entities";
export declare class GroupService {
    private readonly repository;
    constructor(repository: Repository<Group>);
    create(partial: DeepPartial<Group>): Promise<Group>;
    findOne(options: FindOneOptions<Group>): Promise<Group>;
}
