import {Injectable} from "@nestjs/common";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository, SaveOptions,
  UpdateResult
} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {GroupChatMember} from "../entities";

@Injectable()
export class GroupChatMemberService {
  constructor(
    @InjectRepository(GroupChatMember)
    private readonly repository: Repository<GroupChatMember>
  ) {}

  create(options: DeepPartial<GroupChatMember>): Promise<GroupChatMember> {
    const member = this.repository.create(options);

    return this.repository.save(member);
  }

  find(options: FindManyOptions<GroupChatMember>): Promise<GroupChatMember[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<GroupChatMember>): Promise<GroupChatMember> {
    return this.repository.findOne(options);
  }

  count(options: FindManyOptions<GroupChatMember>): Promise<number> {
    return this.repository.count(options);
  }

  delete(criteria: FindConditions<GroupChatMember>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  update(criteria: FindConditions<GroupChatMember>, partial: DeepPartial<GroupChatMember>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  save(partial: DeepPartial<GroupChatMember>, options?: SaveOptions): Promise<GroupChatMember> {
    return this.repository.save(partial, options);
  }
}
