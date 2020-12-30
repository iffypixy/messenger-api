import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, Repository} from "typeorm";

import {User} from "@features/user";
import {Chat, Message} from "../entity";

@Injectable()
export class DialogService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async findByUserId(id: string): Promise<Chat[]> {
    const dialogs = await this.chatRepository
      .createQueryBuilder("dialog")
      .leftJoinAndSelect("dialog.members", "members")
      .getMany();

    return dialogs.filter(({members}) =>
      (members as User[]).map(({id}) => id).includes(id)
    );
  }

  findLastMessageById(id: string): Promise<Message> {
    return this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.chat", "chat")
      .leftJoinAndSelect("message.attachments.files", "files")
      .leftJoinAndSelect("message.attachments.images", "images")
      .leftJoinAndSelect("message.attachments.audio", "audio")
      .where("chat.id = :id", {id})
      .andWhere("chat.type = :type", {type: "dialog"})
      .orderBy("message.createdAt", "DESC")
      .limit(1)
      .getOne();
  }

  async findOneByUsersIdsOrCreate(users: User[]): Promise<Chat> {
    const dialog = await this.findOneByUsersIds(users.map(({id}) => id));

    if (!dialog) {
      const dialog = this.chatRepository.create({members: users, type: "dialog"});

      return this.chatRepository.save(dialog);
    }

    return dialog;
  }

  async findOneByUsersIds(ids: string[]): Promise<Chat> {
    const dialogs = await this.chatRepository
      .createQueryBuilder("dialog")
      .leftJoinAndSelect("dialog.members", "members")
      .where("dialog.type = :type", {type: "dialog"})
      .getMany();

    const dialog = dialogs.find(({members}) =>
      (members as User[]).map(({id}) => id).every(id => ids.includes(id))
    );

    return dialog;
  }

  findMessagesById(
    id: string,
    {take, skip}: FindManyOptions
  ): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.chat", "chat")
      .leftJoinAndSelect("message.attachments.files", "files")
      .leftJoinAndSelect("message.attachments.images", "images")
      .leftJoinAndSelect("message.attachments.audio", "audio")
      .where("chat.id = :chatId", {chatId: id})
      .orderBy("message.createdAt", "ASC")
      .limit(take)
      .skip(skip)
      .getMany();
  }
}
