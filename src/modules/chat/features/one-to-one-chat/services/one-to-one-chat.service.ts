import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, Repository} from "typeorm";

import {OneToOneChat} from "../entities";

@Injectable()
export class OneToOneChatService {
  constructor(
    @InjectRepository(OneToOneChat)
    private readonly chatRepository: Repository<OneToOneChat>
  ) {}

  create(partial: DeepPartial<OneToOneChat>): Promise<OneToOneChat> {
    const chat = this.chatRepository.create(partial);

    return this.chatRepository.save(chat);
  }
}
