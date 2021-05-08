import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {ID} from "@lib/typings";
import {DirectChat, DirectChatMember} from "../entities";
import {DirectChatMemberService} from "./direct-chat-member.service";

@Injectable()
export class DirectChatService {
  constructor(
    @InjectRepository(DirectChat)
    private readonly repository: Repository<DirectChat>,
    private readonly memberService: DirectChatMemberService
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

    const first = firsts.find((first) =>
      seconds.findIndex((second) => second.chat.id === first.chat.id) !== -1) || null;

    const second = first && seconds.find((second) => second.chat.id === first.chat.id);

    return {
      first, second,
      chat: first && first.chat
    };
  }
}
