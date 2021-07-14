import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {User} from "@modules/users";
import {Direct, DirectMember} from "../entities";
import {DirectMembersService} from "./direct-members.service";

@Injectable()
export class DirectsService {
  constructor(
    @InjectRepository(Direct)
    private readonly repository: Repository<Direct>,
    private readonly membersService: DirectMembersService,
  ) {}

  create(partial: DeepPartial<Direct>): Promise<Direct> {
    const chat = this.repository.create(partial);

    return this.repository.save(chat);
  }

  find(options: FindManyOptions<Direct>): Promise<Direct[]> {
    return this.repository.find(options);
  }

  async findOneByUsers(users: User[], {createNew}: {createNew: boolean}): Promise<{first: DirectMember | null; second: DirectMember | null; chat: Direct | null}> {
    const firsts = await this.membersService.find({
      where: {
        user: users[0]
      }
    });

    const seconds = await this.membersService.find({
      where: {
        user: users[1]
      }
    });

    let first = firsts.find(({chat}) => seconds
      .findIndex((second) => second.chat.id === chat.id) !== -1) || null;

    let second = first && seconds.find(({chat}) => chat.id === first.chat.id);

    if (!first && createNew) {
      const chat = await this.create({});

      first = await this.membersService.create({
        user: users[0], chat
      });

      second = await this.membersService.create({
        user: users[1], chat
      });
    }

    return {
      first, second,
      chat: first.chat
    };
  }
}
