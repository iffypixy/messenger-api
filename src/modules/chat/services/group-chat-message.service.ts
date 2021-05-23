import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  OrderByCondition,
  Repository,
  UpdateResult
} from "typeorm";

import {GroupChatMessage} from "../entities";

@Injectable()
export class GroupChatMessageService {
  constructor(
    @InjectRepository(GroupChatMessage)
    private readonly repository: Repository<GroupChatMessage>
  ) {}

  find(options: FindManyOptions<GroupChatMessage>): Promise<GroupChatMessage[]> {
    return this.repository.find(options);
  }

  create(partial: DeepPartial<GroupChatMessage>): Promise<GroupChatMessage> {
    const message = this.repository.create(partial);

    return this.repository.save(message);
  }

  findOne(options: FindOneOptions<GroupChatMessage>): Promise<GroupChatMessage> {
    return this.repository.findOne(options);
  }

  count(options: FindManyOptions<GroupChatMessage>): Promise<number> {
    return this.repository.count(options);
  }

  update(criteria: FindConditions<GroupChatMessage>, partial: DeepPartial<GroupChatMessage>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  findWithAttachments(attachment: "images" | "files" | "audio", options: FindManyOptions<GroupChatMessage>) {
    for (const key in options.order) {
      options.order = {
        [`message.${key}`]: options.order[key]
      };
    }

    return this.repository.createQueryBuilder("message")
      .leftJoinAndSelect("message.chat", "chat")
      .leftJoinAndSelect("message.sender", "sender")
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
