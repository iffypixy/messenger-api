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

import {GroupMessage} from "../entities";

@Injectable()
export class GroupMessagesService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly repository: Repository<GroupMessage>
  ) {
  }

  find(options: FindManyOptions<GroupMessage>): Promise<GroupMessage[]> {
    return this.repository.find(options);
  }

  create(partial: DeepPartial<GroupMessage>): Promise<GroupMessage> {
    const message = this.repository.create(partial);

    return this.repository.save(message);
  }

  findOne(options: FindOneOptions<GroupMessage>): Promise<GroupMessage> {
    return this.repository.findOne(options);
  }

  count(options: FindManyOptions<GroupMessage>): Promise<number> {
    return this.repository.count(options);
  }

  async update(criteria: FindConditions<GroupMessage>, partial: DeepPartial<GroupMessage>, {retrieve}: {
    retrieve: boolean;
  }): Promise<UpdateResult | GroupMessage[]> {
    let result: UpdateResult | GroupMessage[] = await this.repository.update(criteria, partial);

    if (retrieve) result = await this.repository.find({where: criteria});

    return result;
  }

  findAttachments(type: "images" | "files" | "audio", options: FindManyOptions<GroupMessage>) {
    for (const key in options.order) {
      options.order = {
        [`message.${key}`]: options.order[key]
      };
    }

    return this.repository.createQueryBuilder("message")
      .leftJoinAndSelect("message.chats", "chat")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.files", "files")
      .leftJoinAndSelect("message.audio", "audio")
      .leftJoinAndSelect("message.images", "images")
      .leftJoinAndSelect("message.parent", "parent")
      .where(options.where)
      .andWhere(`${type} is not null`)
      .orderBy(options.order as OrderByCondition)
      .skip(options.skip)
      .take(options.take)
      .getMany();
  }
}
