import {Injectable} from "@nestjs/common";
import {Repository, In, FindManyOptions, SelectQueryBuilder, DeepPartial} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {Chat} from "../entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>
  ) {}

  findMany(options: FindManyOptions<Chat>): Promise<Chat[]> {
    return this.chatRepository.find(options);
  }

  findOne(options: FindManyOptions<Chat>): Promise<Chat> {
    return this.chatRepository.findOne(options);
  }

  createOne(entity: DeepPartial<Chat>): Promise<Chat> {
    const chat = this.chatRepository.create(entity);

    return this.chatRepository.save(chat);
  }
}