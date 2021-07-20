import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { DirectMessage } from "../entities";
export declare class DirectMessagesService {
    private readonly repository;
    constructor(repository: Repository<DirectMessage>);
    find(options: FindManyOptions<DirectMessage>): Promise<DirectMessage[]>;
    findOne(options: FindOneOptions<DirectMessage>): Promise<DirectMessage>;
    create(partial: DeepPartial<DirectMessage>): Promise<DirectMessage>;
    count(options: FindManyOptions<DirectMessage>): Promise<number>;
    update(criteria: FindConditions<DirectMessage>, partial: DeepPartial<DirectMessage>, { retrieve }: {
        retrieve: boolean;
    }): Promise<UpdateResult | DirectMessage[]>;
    findAttachments(type: "images" | "files" | "audio", options: FindManyOptions<DirectMessage>): Promise<DirectMessage[]>;
}
