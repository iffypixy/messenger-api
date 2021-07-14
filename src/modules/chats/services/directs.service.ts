import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {UsersService} from "@modules/users";
import {ID} from "@lib/typings";
import {Direct, DirectMember} from "../entities";
import {DirectMembersService} from "./direct-members.service";

@Injectable()
export class DirectsService {
  constructor(
    @InjectRepository(Direct)
    private readonly repository: Repository<Direct>,
    private readonly memberService: DirectMembersService,
    private readonly userService: UsersService
  ) {}

  create(partial: DeepPartial<Direct>): Promise<Direct> {
    const chat = this.repository.create(partial);

    return this.repository.save(chat);
  }

  find(options: FindManyOptions<Direct>): Promise<Direct[]> {
    return this.repository.find(options);
  }

  async findOneByUsersIds(ids: ID[]): Promise<{first: DirectMember | null; second: DirectMember | null; chat: Direct | null}> {
    const firsts = await this.memberService.find({
      where: {
        user: {
          id: ids[0]
        }
      }
    });

    const seconds = await this.memberService.find({
      where: {
        user: {
          id: ids[1]
        }
      }
    });

    let first = firsts.find((first) =>
      seconds.findIndex((second) => second.chat.id === first.chat.id) !== -1) || null;

    let second = first && seconds.find((second) => second.chat.id === first.chat.id);

    if (!first) {
      const chat = await this.create({});

      const firstUser = await this.userService.findById(ids[0]);

      first = await this.memberService.create({
        user: firstUser, chat
      });

      const secondUser = await this.userService.findById(ids[1]);

      second = await this.memberService.create({
        user: secondUser, chat
      });
    }

    return {
      first, second,
      chat: first.chat
    };
  }
}
