import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindOneOptions, Repository} from "typeorm";

import {GroupChat} from "../entities";

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private readonly chatRepository: Repository<GroupChat>
  ) {}

  create(partial: DeepPartial<GroupChat>): Promise<GroupChat> {
    const chat = this.chatRepository.create(partial);

    return this.chatRepository.save(chat);
  }

  findOne(options: FindOneOptions<GroupChat>): Promise<GroupChat> {
    return this.chatRepository.findOne(options);
  }
}
