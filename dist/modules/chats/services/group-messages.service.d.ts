import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { GroupMessage } from "../entities";
export declare class GroupMessagesService {
    private readonly repository;
    constructor(repository: Repository<GroupMessage>);
    find(options: FindManyOptions<GroupMessage>): Promise<GroupMessage[]>;
    create(partial: DeepPartial<GroupMessage>): Promise<GroupMessage>;
    findOne(options: FindOneOptions<GroupMessage>): Promise<GroupMessage>;
    count(options: FindManyOptions<GroupMessage>): Promise<number>;
    update(criteria: FindConditions<GroupMessage>, partial: DeepPartial<GroupMessage>, { retrieve }: {
        retrieve: boolean;
    }): Promise<UpdateResult | GroupMessage[]>;
    findAttachments(type: "images" | "files" | "audio", options: FindManyOptions<GroupMessage>): Promise<GroupMessage[]>;
}
