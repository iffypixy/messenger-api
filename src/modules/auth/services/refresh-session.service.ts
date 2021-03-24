import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindConditions, FindOneOptions, Repository} from "typeorm";
import {DeleteResult} from "typeorm/query-builder/result/DeleteResult";

import {RefreshSession} from "../entities";

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSession)
    private refreshSessionRepository: Repository<RefreshSession>
  ) {}

  create(options: DeepPartial<RefreshSession>): Promise<RefreshSession> {
    const session = this.refreshSessionRepository.create(options);

    return this.refreshSessionRepository.save(session);
  }

  remove(entity: RefreshSession): Promise<RefreshSession> {
    return this.refreshSessionRepository.remove(entity);
  }

  delete(criteria: FindConditions<RefreshSession>): Promise<DeleteResult> {
    return this.refreshSessionRepository.delete(criteria);
  }

  findOne(
    conditions?: FindConditions<RefreshSession>,
    options?: FindOneOptions<RefreshSession>
  ): Promise<RefreshSession> {
    return this.refreshSessionRepository.findOne(conditions, options);
  }
}
