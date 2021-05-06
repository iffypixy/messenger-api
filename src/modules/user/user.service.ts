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

import {ID} from "@lib/typings";
import {User} from "./entities";
import {FindOptions} from "@nestjs/schematics/dist";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {
  }

  create(partial: DeepPartial<User>): Promise<User> {
    const user = this.repository.create(partial);

    return this.repository.save(user);
  }

  findById(id: ID): Promise<User> {
    return this.repository.findOne({id});
  }

  update(criteria: FindConditions<User>, partial: DeepPartial<User>): Promise<UpdateResult> {
    return this.repository.update(criteria, partial);
  }

  findOne(options: FindOneOptions<User>): Promise<User> {
    return this.repository.findOne(options);
  }

  find(options: FindManyOptions<User>): Promise<User[]> {
    return this.repository.find(options);
  }

  save(partial: DeepPartial<User>, options?: SaveOptions): Promise<User> {
    return this.repository.save(partial, options);
  }
}
