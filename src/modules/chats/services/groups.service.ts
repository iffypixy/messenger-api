import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindConditions, FindOneOptions, Repository, UpdateResult} from "typeorm";

import {Group} from "../entities";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly repository: Repository<Group>
  ) {}

  create(partial: DeepPartial<Group>): Promise<Group> {
    const chat = this.repository.create(partial);

    return this.repository.save(chat);
  }

  findOne(options: FindOneOptions<Group>): Promise<Group> {
    return this.repository.findOne(options);
  }

  async update(criteria: FindConditions<Group>, partial: DeepPartial<Group>, {retrieve}: {
    retrieve: boolean;
  }): Promise<UpdateResult | Group[]> {
    let result: UpdateResult | Group[] = await this.repository.update(criteria, partial);

    if (retrieve) result = await this.repository.find({where: criteria});

    return result;
  }
}
