import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {DeepPartial, FindConditions, FindManyOptions, FindOneOptions, Repository, UpdateResult} from "typeorm";
import * as bcrypt from "bcryptjs";

import {User} from "./entity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
  }

  async create(options: DeepPartial<User>): Promise<User> {
    const hashSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(options.password, hashSalt);

    const user = this.userRepository.create({...options, password: hashedPassword});

    return this.userRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({email});
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({id}, {cache: true});
  }

  update(criteria: FindConditions<User>, partial: QueryDeepPartialEntity<User>): Promise<UpdateResult> {
    return this.userRepository.update(criteria, partial);
  }

  findUsersByQuery(query: string, {limit}: {limit: number}): Promise<User[]> {
    return this.userRepository.createQueryBuilder("user")
      .where("user.firstName like :name", {name: `%${query}%`})
      .orWhere("user.lastName like :name", {name: `%${query}%`})
      .limit(limit)
      .getMany();
  }
}