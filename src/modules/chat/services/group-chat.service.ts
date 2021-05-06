import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindOneOptions, Repository} from "typeorm";

import {GroupChat} from "../entities";

@Injectable()
export class GroupChatService {
  constructor(
    @InjectRepository(GroupChat)
    private readonly repository: Repository<GroupChat>
  ) {}

  create(partial: DeepPartial<GroupChat>): Promise<GroupChat> {
    const chat = this.repository.create(partial);

    return this.repository.save(chat);
  }

  findOne(options: FindOneOptions<GroupChat>): Promise<GroupChat> {
    return this.repository.findOne(options);
  }
}
