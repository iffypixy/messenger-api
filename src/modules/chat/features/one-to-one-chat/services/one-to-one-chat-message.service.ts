import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  FindOneOptions
} from "typeorm";

import {ID, RequestOptions} from "@lib/typings";
import {AttachmentType} from "@modules/chat";
import {OneToOneChatMessage} from "../entities";

@Injectable()
export class OneToOneChatMessageService {
  constructor(
    @InjectRepository(OneToOneChatMessage)
    private readonly messageRepository: Repository<OneToOneChatMessage>
  ) {}

  find(
    options: FindManyOptions<OneToOneChatMessage>
  ): Promise<OneToOneChatMessage[]> {
    return this.messageRepository.find(options);
  }

  findOne(
    options: FindOneOptions<OneToOneChatMessage>
  ): Promise<OneToOneChatMessage> {
    return this.messageRepository.findOne(options);
  }

  create(
    partial: DeepPartial<OneToOneChatMessage>
  ): Promise<OneToOneChatMessage> {
    const msg = this.messageRepository.create(partial);

    return this.messageRepository.save(msg);
  }

  findManyWithAttachmentByChatId(
    {id, type}: {id: ID; type: AttachmentType},
    {offset}: RequestOptions
  ): Promise<OneToOneChatMessage[]> {
    return this.messageRepository
      .createQueryBuilder("msg")
      .leftJoinAndSelect("msg.attachment", "attachment")
      .leftJoinAndSelect("msg.chat", "chat")
      .leftJoinAndSelect("msg.sender.member", "member")
      .leftJoinAndSelect("member.user", "user")
      .leftJoinAndSelect("attachment.files", "file")
      .leftJoinAndSelect("attachment.images", "image")
      .leftJoinAndSelect("attachment.audio", "audio")
      .where("chat.id = :id", {id})
      .andWhere("msg.sender.type = :type", {type: "user"})
      .andWhere(`${type} IS NOT NULL`)
      .orderBy("msg.createdAt", "DESC")
      .limit(15)
      .skip(offset)
      .getMany();
  }
}
