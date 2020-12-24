import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, Repository} from "typeorm";

import {Message} from "../entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  create(options: DeepPartial<Message>): Promise<Message> {
    const message = this.messageRepository.create(options);

    return this.messageRepository.save(message);
  }
}
