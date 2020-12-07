import {InjectRepository} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";
import {DeepPartial, DeleteResult, FindConditions, Repository} from "typeorm";
import {ConfigService} from "@nestjs/config";

import {RefreshSession} from "../entity";

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSession)
    private readonly refreshSessionRepository: Repository<RefreshSession>,
    private readonly configService: ConfigService
  ) {
  }

  create(options: DeepPartial<RefreshSession>): Promise<RefreshSession> {
    const refreshSession = this.refreshSessionRepository.create(options);

    return this.refreshSessionRepository.save(refreshSession);
  }

  findOne(conditions: FindConditions<RefreshSession>): Promise<RefreshSession | null> {
    return this.refreshSessionRepository.findOne(conditions);
  }
  
  delete(conditions: FindConditions<RefreshSession>): Promise<DeleteResult> {
    return this.refreshSessionRepository.delete(conditions);
  }

  getExpirationDate(): Date {
    return new Date(
      Date.now() +
      Number(this.configService.get<string>("jwt.refreshToken.expiresIn"))
    );
  }
}