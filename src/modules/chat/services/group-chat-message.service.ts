import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult} from "typeorm";

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

  update(criteria: FindConditions<GroupChatMessage>, partial: DeepPartial<GroupChatMessage>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }
}
