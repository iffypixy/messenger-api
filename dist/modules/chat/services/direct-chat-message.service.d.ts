import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { DirectChatMessage } from "../entities";
export declare class DirectChatMessageService {
    private readonly repository;
    constructor(repository: Repository<DirectChatMessage>);
    find(options: FindManyOptions<DirectChatMessage>): Promise<DirectChatMessage[]>;
    findOne(options: FindOneOptions<DirectChatMessage>): Promise<DirectChatMessage>;
    create(partial: DeepPartial<DirectChatMessage>): Promise<DirectChatMessage>;
    count(options: FindManyOptions<DirectChatMessage>): Promise<number>;
    delete(criteria: FindConditions<DirectChatMessage>): Promise<DeleteResult>;
    update(criteria: FindConditions<DirectChatMessage>, partial: DeepPartial<DirectChatMessage>): Promise<UpdateResult>;
    findAndCount(options: FindManyOptions<DirectChatMessage>): Promise<[DirectChatMessage[], number]>;
    save(partial: DeepPartial<DirectChatMessage>, options?: SaveOptions): Promise<DirectChatMessage>;
    findWithAttachments(attachment: "images" | "files" | "audio", options: FindManyOptions<DirectChatMessage>): Promise<DirectChatMessage[]>;
}
