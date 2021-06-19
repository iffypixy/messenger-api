import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {UserService} from "@modules/user";
import {ID} from "@lib/typings";
import {DirectChat, DirectChatMember} from "../entities";
import {DirectChatMemberService} from "./direct-chat-member.service";

@Injectable()
export class DirectChatService {
  constructor(
    @InjectRepository(DirectChat)
    private readonly repository: Repository<DirectChat>,
    private readonly memberService: DirectChatMemberService,
    private readonly userService: UserService
  ) {}

  create(partial: DeepPartial<DirectChat>): Promise<DirectChat> {
    const chat = this.repository.create(partial);

    return this.repository.save(chat);
  }

  find(options: FindManyOptions<DirectChat>): Promise<DirectChat[]> {
    return this.repository.find(options);
  }

  async findOneByUsersIds(ids: ID[]): Promise<{first: DirectChatMember | null; second: DirectChatMember | null; chat: DirectChat | null}> {
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

      console.log(!!first, "da");

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
