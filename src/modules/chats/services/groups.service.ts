import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindOneOptions, Repository} from "typeorm";

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
}
