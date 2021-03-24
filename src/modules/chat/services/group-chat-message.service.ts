import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {GroupChatMessage} from "../entities";

@Injectable()
export class GroupChatMessageService {
  constructor(
    @InjectRepository(GroupChatMessage)
    private readonly messageRepository: Repository<GroupChatMessage>
  ) {}

  find(
    options: FindManyOptions<GroupChatMessage>
  ): Promise<GroupChatMessage[]> {
    return this.messageRepository.find(options);
  }

  create(partial: DeepPartial<GroupChatMessage>): Promise<GroupChatMessage> {
    const message = this.messageRepository.create(partial);

    return this.messageRepository.save(message);
  }
}
