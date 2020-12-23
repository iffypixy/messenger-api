import {User} from "@features/user";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Chat} from "../entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>
  ) {}

  // @TODO: make correct queries

  async findByMemberId(memberId: number): Promise<Chat[]> {
    const chats = await this.chatRepository.find({relations: ["members"]});

    return chats.filter(chat =>
      chat.members.map(({id}) => id).some(id => id === memberId)
    );
  }

  async findOneByMembers(members: User[]): Promise<Chat> {
    const chats = await this.chatRepository.find({relations: ["members"]});

    return chats.find(chat =>
      chat.members
        .map(({id}) => id)
        .every(id => members.map(({id}) => id).includes(id))
    );
  }

  async findByMembersOrCreate(members: User[]): Promise<Chat> {
    const chat = await this.findOneByMembers(members);

    if (!chat) {
      const dialog = this.chatRepository.create({members});

      return this.chatRepository.save(dialog);
    }

    return chat;
  }
}
