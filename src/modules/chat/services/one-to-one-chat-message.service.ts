import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  FindOneOptions
} from "typeorm";

import {OneToOneChatMessage} from "../entities";

@Injectable()
export class OneToOneChatMessageService {
  constructor(
    @InjectRepository(OneToOneChatMessage)
    private readonly messageRepository: Repository<OneToOneChatMessage>
  ) {}

  find(
    options: FindManyOptions<OneToOneChatMessage>
  ): Promise<OneToOneChatMessage[]> {
    return this.messageRepository.find(options);
  }

  findOne(
    options: FindOneOptions<OneToOneChatMessage>
  ): Promise<OneToOneChatMessage> {
    return this.messageRepository.findOne(options);
  }

  create(
    partial: DeepPartial<OneToOneChatMessage>
  ): Promise<OneToOneChatMessage> {
    const msg = this.messageRepository.create(partial);

    return this.messageRepository.save(msg);
  }
}
