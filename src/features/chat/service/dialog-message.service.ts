import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {DialogMessage} from "../entity";

@Injectable()
export class DialogMessageService {
  constructor(
    @InjectRepository(DialogMessage)
    private readonly dialogMessageRepository: Repository<DialogMessage>
  ) {}

  create(options: DeepPartial<DialogMessage>): Promise<DialogMessage> {
    const message = this.dialogMessageRepository.create(options);

    return this.dialogMessageRepository.save(message);
  }

  findLatestByDialogId(dialogId: number): Promise<DialogMessage> {
    return this.dialogMessageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .where("message.dialog.id = :dialogId", {dialogId})
    .orderBy("message.createdAt", "DESC")
    .limit(1)
    .getOne();
  }

  findByDialogId(dialogId: number, {skip, take}: FindManyOptions): Promise<DialogMessage[]> {
    return this.dialogMessageRepository
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "sender")
    .where("message.dialog.id = :dialogId", {dialogId})
    .orderBy("message.createdAt", "DESC")
    .limit(take)
    .skip(skip)
    .getMany();
  }
}
