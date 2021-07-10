import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { GroupChatMessage } from "../entities";
export declare class GroupChatMessageService {
    private readonly repository;
    constructor(repository: Repository<GroupChatMessage>);
    find(options: FindManyOptions<GroupChatMessage>): Promise<GroupChatMessage[]>;
    create(partial: DeepPartial<GroupChatMessage>): Promise<GroupChatMessage>;
    findOne(options: FindOneOptions<GroupChatMessage>): Promise<GroupChatMessage>;
    count(options: FindManyOptions<GroupChatMessage>): Promise<number>;
    update(criteria: FindConditions<GroupChatMessage>, partial: DeepPartial<GroupChatMessage>): Promise<UpdateResult>;
    findWithAttachments(attachment: "images" | "files" | "audio", options: FindManyOptions<GroupChatMessage>): Promise<GroupChatMessage[]>;
}
