import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository, SaveOptions,
  UpdateResult
} from "typeorm";

import {OneToOneChatMessage} from "../entities";

@Injectable()
export class OneToOneChatMessageService {
  constructor(
    @InjectRepository(OneToOneChatMessage)
    private readonly repository: Repository<OneToOneChatMessage>
  ) {}

  find(options: FindManyOptions): Promise<OneToOneChatMessage[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<OneToOneChatMessage>): Promise<OneToOneChatMessage> {
    return this.repository.findOne(options);
  }

  create(partial: DeepPartial<OneToOneChatMessage>): Promise<OneToOneChatMessage> {
    const message = this.repository.create(partial);

    return this.repository.save(message);
  }

  count(options: FindManyOptions<OneToOneChatMessage>): Promise<number> {
    return this.repository.count(options);
  }

  delete(criteria: FindConditions<OneToOneChatMessage>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  update(criteria: FindConditions<OneToOneChatMessage>, partial: DeepPartial<OneToOneChatMessage>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  save(partial: DeepPartial<OneToOneChatMessage>, options?: SaveOptions): Promise<OneToOneChatMessage> {
    return this.repository.save(partial, options);
  }
}
