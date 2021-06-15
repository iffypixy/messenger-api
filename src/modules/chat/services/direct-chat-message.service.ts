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

import {DirectChatMessage} from "../entities";

@Injectable()
export class DirectChatMessageService {
  constructor(
    @InjectRepository(DirectChatMessage)
    private readonly repository: Repository<DirectChatMessage>
  ) {}

  find(options: FindManyOptions<DirectChatMessage>): Promise<DirectChatMessage[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<DirectChatMessage>): Promise<DirectChatMessage> {
    return this.repository.findOne(options);
  }

  create(partial: DeepPartial<DirectChatMessage>): Promise<DirectChatMessage> {
    const message = this.repository.create(partial);

    return this.repository.save(message);
  }

  count(options: FindManyOptions<DirectChatMessage>): Promise<number> {
    return this.repository.count(options);
  }

  delete(criteria: FindConditions<DirectChatMessage>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  update(criteria: FindConditions<DirectChatMessage>, partial: DeepPartial<DirectChatMessage>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  findAndCount(options: FindManyOptions<DirectChatMessage>): Promise<[DirectChatMessage[], number]> {
    return this.repository.findAndCount(options);
  }

  save(partial: DeepPartial<DirectChatMessage>, options?: SaveOptions): Promise<DirectChatMessage> {
    return this.repository.save(partial, options);
  }

  findWithAttachments(attachment: "images" | "files" | "audio", options: FindManyOptions<DirectChatMessage>) {
    for (const key in options.order) {
      options.order = {
        [`message.${key}`]: options.order[key]
      };
    }

    return this.repository.createQueryBuilder("message")
      .leftJoinAndSelect("message.chat", "chat")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("sender.user", "user")
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
