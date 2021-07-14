import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions, OrderByCondition,
  Repository, SaveOptions,
  UpdateResult
} from "typeorm";

import {DirectMessage} from "../entities";

@Injectable()
export class DirectMessagesService {
  constructor(
    @InjectRepository(DirectMessage)
    private readonly repository: Repository<DirectMessage>
  ) {}

  find(options: FindManyOptions<DirectMessage>): Promise<DirectMessage[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<DirectMessage>): Promise<DirectMessage> {
    return this.repository.findOne(options);
  }

  create(partial: DeepPartial<DirectMessage>): Promise<DirectMessage> {
    const message = this.repository.create(partial);

    return this.repository.save(message);
  }

  count(options: FindManyOptions<DirectMessage>): Promise<number> {
    return this.repository.count(options);
  }

  delete(criteria: FindConditions<DirectMessage>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  update(criteria: FindConditions<DirectMessage>, partial: DeepPartial<DirectMessage>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  findAndCount(options: FindManyOptions<DirectMessage>): Promise<[DirectMessage[], number]> {
    return this.repository.findAndCount(options);
  }

  save(partial: DeepPartial<DirectMessage>, options?: SaveOptions): Promise<DirectMessage> {
    return this.repository.save(partial, options);
  }

  findWithAttachments(attachment: "images" | "files" | "audio", options: FindManyOptions<DirectMessage>) {
    for (const key in options.order) {
      options.order = {
        [`message.${key}`]: options.order[key]
      };
    }

    return this.repository.createQueryBuilder("message")
      .leftJoinAndSelect("message.chats", "chat")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("sender.users", "user")
      .leftJoinAndSelect("message.files", "files")
      .leftJoinAndSelect("message.audio", "audio")
      .leftJoinAndSelect("message.images", "images")
      .leftJoinAndSelect("message.parent", "parent")
      .where(options.where)
      .andWhere(`${attachment} is not null`)
      .orderBy(options.order as OrderByCondition)
      .skip(options.skip)
      .take(options.take)
      .getMany();
  }
}
