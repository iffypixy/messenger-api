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

import {DirectChatMember} from "../entities";

@Injectable()
export class DirectChatMemberService {
  constructor(
    @InjectRepository(DirectChatMember)
    private readonly repository: Repository<DirectChatMember>
  ) {}

  findOne(options: FindOneOptions<DirectChatMember>): Promise<DirectChatMember> {
    return this.repository.findOne(options);
  }

  create(partial: DeepPartial<DirectChatMember>): Promise<DirectChatMember> {
    const member = this.repository.create(partial);

    return this.repository.save(member);
  }

  find(options: FindManyOptions<DirectChatMember>): Promise<DirectChatMember[]> {
    return this.repository.find(options);
  }

  update(criteria: FindConditions<DirectChatMember>, partial: DeepPartial<DirectChatMember>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  save(partial: DeepPartial<DirectChatMember>, options?: SaveOptions): Promise<DirectChatMember> {
    return this.repository.save(partial, options);
  }
}

