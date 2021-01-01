import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository, DeepPartial} from "typeorm";

import {Chat, Message} from "../entity";

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {
  }

  create(options: DeepPartial<Chat>): Promise<Chat> {
    const dialog = this.chatRepository.create({...options, type: "dialog"});

    return this.chatRepository.save(dialog);
  }

  async findByUserId(id: string): Promise<Chat[]> {
    const dialogs = await this.chatRepository.createQueryBuilder("dialog")
      .leftJoinAndSelect("dialog.members", "members")
      .getMany();

    return dialogs.filter(({members}) => members.map(({id}) => id).includes(id));
  }

  async findOneByUsersIds(ids: string[]): Promise<Chat> {
    const dialogs = await this.chatRepository.createQueryBuilder("dialog")
      .leftJoinAndSelect("dialog.members", "members")
      .where("dialog.type = :type", {type: "dialog"})
      .getMany();

    return dialogs.find(({members}) =>
      members.map(({id}) => id).every(id => ids.includes(id)));
  }
}
