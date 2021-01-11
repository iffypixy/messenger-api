import {Injectable} from "@nestjs/common";
import {DeepPartial, FindManyOptions, FindOneOptions, Repository, SelectQueryBuilder} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {Message} from "../entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  count(options: FindManyOptions<Message>): Promise<number> {
    return this.messageRepository.count(options);
  }

  createOne(entity: DeepPartial<Message>): Promise<Message> {
    const message = this.messageRepository.create(entity);

    return this.messageRepository.save(message);
  }

  findMany(options: FindManyOptions<Message>): Promise<Message[]> {
    return this.messageRepository.find(options);
  }

  findOne(options: FindOneOptions<Message>): Promise<Message> {
    return this.messageRepository.findOne(options);
  }
}