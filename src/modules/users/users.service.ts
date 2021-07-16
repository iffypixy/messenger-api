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

@Injectable()
export class UsersService {
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

  async update(criteria: FindConditions<User>, partial: DeepPartial<User>, {retrieve}: {
    retrieve: boolean;
  }): Promise<UpdateResult | User[]> {
    let result: UpdateResult | User[] = await this.repository.update(criteria, partial);

    if (retrieve) result = await this.repository.find({where: criteria});

    return result;
  }

  findOne(options: FindOneOptions<User>): Promise<User> {
    return this.repository.findOne(options);
  }

  find(options: FindManyOptions<User>): Promise<User[]> {
    return this.repository.find(options);
  }
}
