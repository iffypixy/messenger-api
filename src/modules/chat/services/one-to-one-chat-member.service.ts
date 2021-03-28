import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository
} from "typeorm";

import {User} from "@modules/user";
import {OneToOneChatMember} from "../entities";
import {OneToOneChatService} from "./one-to-one-chat.service";

@Injectable()
export class OneToOneChatMemberService {
  constructor(
    @InjectRepository(OneToOneChatMember)
    private readonly memberRepository: Repository<OneToOneChatMember>,
    private readonly chatService: OneToOneChatService
  ) {}

  findOne(
    options: FindOneOptions<OneToOneChatMember>
  ): Promise<OneToOneChatMember> {
    return this.memberRepository.findOne(options);
  }

  create(
    partial: DeepPartial<OneToOneChatMember>
  ): Promise<OneToOneChatMember> {
    const member = this.memberRepository.create(partial);

    return this.memberRepository.save(member);
  }

  find(
    options: FindManyOptions<OneToOneChatMember>
  ): Promise<OneToOneChatMember[]> {
    return this.memberRepository.find(options);
  }

  async createByUsers(users: User[]): Promise<OneToOneChatMember> {
    const chat = await this.chatService.create({});

    const member = await this.create({chat, user: users[0]});
    await this.create({chat, user: users[1]});

    return member;
  }

  async findOneByUsers(users: User[]): Promise<OneToOneChatMember | null> {
    const firsts = await this.find({
      where: {
        user: {
          id: users[0].id
        }
      }
    });

    const seconds = await this.find({
      where: {
        user: {
          id: users[1].id
        }
      }
    });

    return (
      firsts.find(
        ({chat}) =>
          seconds.findIndex(second => second.chat.id === chat.id) !== -1
      ) || null
    );
  }
}
