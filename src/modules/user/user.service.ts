import {InjectRepository} from "@nestjs/typeorm";
import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
  UpdateResult
} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

import {RequestOptions, ID} from "@lib/typings";
import {WebsocketsService} from "@lib/websockets";
import {User} from "./entities";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => WebsocketsService))
    private readonly websocketsService: WebsocketsService
  ) {}

  async create(partial: DeepPartial<User>): Promise<User> {
    const user = this.userRepository.create(partial);

    return this.userRepository.save(user);
  }

  findById(id: ID): Promise<User | null> {
    return this.userRepository.findOne({id}, {cache: true});
  }

  update(
    criteria: FindConditions<User>,
    partial: QueryDeepPartialEntity<User>
  ): Promise<UpdateResult> {
    return this.userRepository.update(criteria, partial);
  }

  findOne(
    conditions?: FindConditions<User>,
    options?: FindOneOptions
  ): Promise<User> {
    return this.userRepository.findOne(conditions, options);
  }

  findUsersByLoginQuery(
    query: string,
    {limit}: RequestOptions
  ): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder("user")
      .where("user.login ilike :login", {login: `%${query}%`})
      .limit(limit)
      .getMany();
  }

  save(entity: DeepPartial<User>, options?: SaveOptions): Promise<User> {
    return this.userRepository.save(entity, options);
  }

  find(options: FindManyOptions<User>): Promise<User[]> {
    return this.userRepository.find(options);
  }

  getIsOnlineById(id: ID): boolean {
    const sockets = this.websocketsService.getSocketsByUserId(id);

    return sockets.findIndex(socket => socket.connected) !== -1;
  }
}
