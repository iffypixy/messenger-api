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

  update(criteria: FindConditions<DirectMember>, partial: DeepPartial<DirectMember>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  save(partial: DeepPartial<DirectMember>, options?: SaveOptions): Promise<DirectMember> {
    return this.repository.save(partial, options);
  }
}

