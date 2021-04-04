import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  RemoveOptions,
  SaveOptions,
  TreeRepository,
  UpdateResult
} from "typeorm";

import {ID, RequestOptions} from "@lib/typings";
import {queryLimit} from "@lib/constants";
import {GroupChatMessage} from "../entities";
import {AttachmentType} from "../lib/typings";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class GroupChatMessageService {
  constructor(
    @InjectRepository(GroupChatMessage)
    private readonly messageRepository: TreeRepository<GroupChatMessage>
  ) {}

  find(
    options: FindManyOptions<GroupChatMessage>
  ): Promise<GroupChatMessage[]> {
    return this.messageRepository.find(options);
  }

  create(partial: DeepPartial<GroupChatMessage>): Promise<GroupChatMessage> {
    const message = this.messageRepository.create(partial);

    return this.messageRepository.save(message);
  }

  async findReplyTo(
    message: GroupChatMessage
  ): Promise<GroupChatMessage | null> {
    const msg = (await this.messageRepository.findAncestors(message))[0];

    if (!msg) return null;

    return msg.id === message.id ? null : this.findOne({where: {id: msg.id}});
  }

  findOne(
    options: FindOneOptions<GroupChatMessage>
  ): Promise<GroupChatMessage> {
    return this.messageRepository.findOne(options);
  }

  findManyWithAttachmentByChatId(
    {id, type}: {id: ID; type: AttachmentType},
    {offset}: RequestOptions
  ): Promise<GroupChatMessage[]> {
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

  remove(
    entities: GroupChatMessage[],
    options?: RemoveOptions
  ): Promise<GroupChatMessage[]> {
    return this.messageRepository.remove(entities, options);
  }

  update(
    conditions: FindConditions<GroupChatMessage>,
    partial: QueryDeepPartialEntity<GroupChatMessage>
  ): Promise<UpdateResult> {
    return this.messageRepository.update(conditions, partial);
  }

  save(
    partial: DeepPartial<GroupChatMessage>,
    options?: SaveOptions
  ): Promise<GroupChatMessage> {
    return this.messageRepository.save(partial, options);
  }
}
