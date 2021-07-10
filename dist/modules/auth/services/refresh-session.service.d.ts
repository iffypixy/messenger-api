import { DeepPartial, DeleteResult, FindConditions, FindOneOptions, Repository } from "typeorm";
import { RefreshSession } from "../entities";
export declare class RefreshSessionService {
    private repository;
    constructor(repository: Repository<RefreshSession>);
    create(options: DeepPartial<RefreshSession>): Promise<RefreshSession>;
    delete(criteria: FindConditions<RefreshSession>): Promise<DeleteResult>;
    findOne(options: FindOneOptions<RefreshSession>): Promise<RefreshSession>;
}
