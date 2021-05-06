import {Injectable} from "@nestjs/common";
import {DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, Repository} from "typeorm";
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
}
