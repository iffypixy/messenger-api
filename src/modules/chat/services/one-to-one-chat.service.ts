import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {ID} from "@lib/typings";
import {OneToOneChat, OneToOneChatMember} from "../entities";
import {OneToOneChatMemberService} from "./one-to-one-chat-member.service";

@Injectable()
export class OneToOneChatService {
  constructor(
    @InjectRepository(OneToOneChat)
    private readonly repository: Repository<OneToOneChat>,
    private readonly memberService: OneToOneChatMemberService
  ) {}

  create(partial: DeepPartial<OneToOneChat>): Promise<OneToOneChat> {
    const chat = this.repository.create(partial);

    return this.repository.save(chat);
  }

  find(options: FindManyOptions<OneToOneChat>): Promise<OneToOneChat[]> {
    return this.repository.find(options);
  }

  async findOneByUsersIds(ids: ID[]): Promise<{first: OneToOneChatMember | null; second: OneToOneChatMember | null; chat: OneToOneChat | null}> {
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
