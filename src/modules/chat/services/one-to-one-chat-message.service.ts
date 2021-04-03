import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
  FindConditions,
  DeleteResult,
  TreeRepository,
  UpdateResult,
  SaveOptions
} from "typeorm";

import {ID, RequestOptions} from "@lib/typings";
import {queryLimit} from "@lib/constants";
import {OneToOneChatMessage} from "../entities";
import {AttachmentType} from "../lib/typings";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class OneToOneChatMessageService {
  constructor(
    @InjectRepository(OneToOneChatMessage)
    private readonly messageRepository: TreeRepository<OneToOneChatMessage>
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

  async findReplyTo(
    message: OneToOneChatMessage
  ): Promise<OneToOneChatMessage | null> {
    const msg = (await this.messageRepository.findAncestors(message))[0];

    if (!msg) return null;

    return msg.id === message.id ? null : this.findOne({where: {id: msg.id}});
  }

  count(options: FindManyOptions<OneToOneChatMessage>): Promise<number> {
    return this.messageRepository.count(options);
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
      .limit(queryLimit)
      .skip(offset)
      .getMany();
  }

  delete(
    conditions: FindConditions<OneToOneChatMessage>
  ): Promise<DeleteResult> {
    return this.messageRepository.delete(conditions);
  }

  update(
    conditions: FindConditions<OneToOneChatMessage>,
    partial: QueryDeepPartialEntity<OneToOneChatMessage>
  ): Promise<UpdateResult> {
    return this.messageRepository.update(conditions, partial);
  }

  save(
    partial: DeepPartial<OneToOneChatMessage>,
    options?: SaveOptions
  ): Promise<OneToOneChatMessage> {
    return this.messageRepository.save(partial, options);
  }
}
