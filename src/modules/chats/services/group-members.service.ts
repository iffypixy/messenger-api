import {Injectable} from "@nestjs/common";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult
} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

import {GroupMember} from "../entities";

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly repository: Repository<GroupMember>
  ) {}

  create(options: DeepPartial<GroupMember>): Promise<GroupMember> {
    const member = this.repository.create(options);

    return this.repository.save(member);
  }

  find(options: FindManyOptions<GroupMember>): Promise<GroupMember[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<GroupMember>): Promise<GroupMember> {
    return this.repository.findOne(options);
  }

  count(options: FindManyOptions<GroupMember>): Promise<number> {
    return this.repository.count(options);
  }

  delete(criteria: FindConditions<GroupMember>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  async update(criteria: FindConditions<GroupMember>, partial: DeepPartial<GroupMember>, {retrieve}: {
    retrieve: boolean;
  }): Promise<UpdateResult | GroupMember[]> {
    let result: UpdateResult | GroupMember[] = await this.repository.update(criteria, partial);

    if (retrieve) result = await this.repository.find({where: criteria});

    return result;
  }
}
