import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, Repository, SaveOptions, UpdateResult } from "typeorm";
import { DirectMessage } from "../entities";
export declare class DirectMessagesService {
    private readonly repository;
    constructor(repository: Repository<DirectMessage>);
    find(options: FindManyOptions<DirectMessage>): Promise<DirectMessage[]>;
    findOne(options: FindOneOptions<DirectMessage>): Promise<DirectMessage>;
    create(partial: DeepPartial<DirectMessage>): Promise<DirectMessage>;
    count(options: FindManyOptions<DirectMessage>): Promise<number>;
    delete(criteria: FindConditions<DirectMessage>): Promise<DeleteResult>;
    update(criteria: FindConditions<DirectMessage>, partial: DeepPartial<DirectMessage>): Promise<UpdateResult>;
    findAndCount(options: FindManyOptions<DirectMessage>): Promise<[DirectMessage[], number]>;
    save(partial: DeepPartial<DirectMessage>, options?: SaveOptions): Promise<DirectMessage>;
    findWithAttachments(attachment: "images" | "files" | "audio", options: FindManyOptions<DirectMessage>): Promise<DirectMessage[]>;
}
