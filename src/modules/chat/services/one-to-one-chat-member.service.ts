import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
  UpdateResult
} from "typeorm";

import {OneToOneChatMember} from "../entities";

@Injectable()
export class OneToOneChatMemberService {
  constructor(
    @InjectRepository(OneToOneChatMember)
    private readonly repository: Repository<OneToOneChatMember>
  ) {}

  findOne(options: FindOneOptions<OneToOneChatMember>): Promise<OneToOneChatMember> {
    return this.repository.findOne(options);
  }

  create(partial: DeepPartial<OneToOneChatMember>): Promise<OneToOneChatMember> {
    const member = this.repository.create(partial);

    return this.repository.save(member);
  }

  find(options: FindManyOptions<OneToOneChatMember>): Promise<OneToOneChatMember[]> {
    return this.repository.find(options);
  }

  update(criteria: FindConditions<OneToOneChatMember>, partial: DeepPartial<OneToOneChatMember>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  save(partial: DeepPartial<OneToOneChatMember>, options?: SaveOptions): Promise<OneToOneChatMember> {
    return this.repository.save(partial, options);
  }
}

