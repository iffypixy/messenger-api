import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, DeleteResult, FindConditions, FindOneOptions, Repository} from "typeorm";

import {RefreshSession} from "../entities";

@Injectable()
export class RefreshSessionsService {
  constructor(
    @InjectRepository(RefreshSession)
    private repository: Repository<RefreshSession>
  ) {}

  create(options: DeepPartial<RefreshSession>): Promise<RefreshSession> {
    const session = this.repository.create(options);

    return this.repository.save(session);
  }

  delete(criteria: FindConditions<RefreshSession>): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  findOne(options: FindOneOptions<RefreshSession>): Promise<RefreshSession> {
    return this.repository.findOne(options);
  }
}
