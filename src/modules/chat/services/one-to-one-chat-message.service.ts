import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  FindOneOptions
} from "typeorm";

import {ID, RequestOptions} from "@lib/typings";
import {OneToOneChatMessage} from "../entities";
import {AttachmentType} from "../lib/attachment-types";
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
      .leftJoinAndSelect("attachment.files", "files")
      .leftJoinAndSelect("attachment.images", "images")
      .leftJoinAndSelect("attachment.audio", "audio")
      .where("chat.id = :id", {id})
      .andWhere(
        "attachment.includes @> ARRAY[:types::attachment_includes_enum[]]",
        {types: [type]}
      )
      .orderBy("msg.createdAt", "DESC")
      .limit(15)
      .skip(offset)
      .getMany();
  }
}
