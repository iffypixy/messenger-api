import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult
} from "typeorm";

import {DirectMember} from "../entities";

@Injectable()
export class DirectMembersService {
  constructor(
    @InjectRepository(DirectMember)
    private readonly repository: Repository<DirectMember>
  ) {}

  findOne(options: FindOneOptions<DirectMember>): Promise<DirectMember> {
    return this.repository.findOne(options);
  }

  create(partial: DeepPartial<DirectMember>): Promise<DirectMember> {
    const member = this.repository.create(partial);

    return this.repository.save(member);
  }

  find(options: FindManyOptions<DirectMember>): Promise<DirectMember[]> {
    return this.repository.find(options);
  }

  async update(criteria: FindConditions<DirectMember>, partial: DeepPartial<DirectMember>, {retrieve}: {
    retrieve: boolean;
  }): Promise<UpdateResult | DirectMember[]> {
    let result: UpdateResult | DirectMember[] = await this.repository.update(criteria, partial);

    if (retrieve) result = await this.repository.find({where: criteria});

    return result;
  }
}

