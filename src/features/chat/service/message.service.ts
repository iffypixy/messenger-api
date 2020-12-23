import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {Message} from "../entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  create(options: DeepPartial<Message>): Promise<Message> {
    const message = this.messageRepository.create(options);

    return this.messageRepository.save(message);
  }

  findLatestByDialogId(dialogId: number): Promise<Message> {
    return this.messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .leftJoinAndSelect("message.attachments.audio", "audio")
    .where("message.dialog.id = :dialogId", {dialogId})
    .orderBy("message.createdAt", "DESC")
    .limit(1)
    .getOne();
  }

  findByDialogId(dialogId: number, {skip, take}: FindManyOptions): Promise<Message[]> {
    return this.messageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .where("message.dialog.id = :dialogId", {dialogId})
    .orderBy("message.createdAt", "DESC")
    .limit(take)
    .skip(skip)
    .getMany();
  }
}
