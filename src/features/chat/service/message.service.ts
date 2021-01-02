import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions, FindOneOptions,
  Repository,
  UpdateResult
} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

import {Message} from "../entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {
  }

  create(options: DeepPartial<Message>): Promise<Message> {
    const message = this.messageRepository.create(options);

    return this.messageRepository.save(message);
  }

  update(criteria: FindConditions<Message>, partialEntity: QueryDeepPartialEntity<Message>): Promise<UpdateResult> {
    return this.messageRepository.update(criteria, partialEntity);
  }

  delete(criteria: FindConditions<Message>): Promise<DeleteResult> {
    return this.messageRepository.delete(criteria);
  }

  count(conditions: FindConditions<Message>): Promise<number> {
    return this.messageRepository.count(conditions);
  }

  findOne(options: FindOneOptions<Message>): Promise<Message> {
    return this.messageRepository.findOne(options);
  }

  find(options: FindManyOptions<Message>): Promise<Message[]> {
    return this.messageRepository.find(options);
  }
}
