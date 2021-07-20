import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { GroupChat } from "../entities";
export declare class GroupChatService {
    private readonly repository;
    constructor(repository: Repository<GroupChat>);
    create(partial: DeepPartial<GroupChat>): Promise<GroupChat>;
    findOne(options: FindOneOptions<GroupChat>): Promise<GroupChat>;
}
