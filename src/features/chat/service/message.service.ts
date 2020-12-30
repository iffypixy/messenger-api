import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindConditions, Repository, UpdateResult} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

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

  update(criteria: FindConditions<Message>, partialEntity: QueryDeepPartialEntity<Message>): Promise<UpdateResult> {
    return this.messageRepository.update(criteria, partialEntity);
  }
}
