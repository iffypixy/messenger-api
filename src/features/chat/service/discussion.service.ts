import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {User} from "@features/user";
import {Chat} from "../entity";

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>
  ) {}

  
}
