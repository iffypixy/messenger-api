import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, FindManyOptions, Repository} from "typeorm";

import {ID, RequestOptions} from "@lib/typings";
import {AttachmentType} from "@modules/chat";
import {GroupChatMessage} from "../entities";

@Injectable()
export class GroupChatMessageService {
  constructor(
    @InjectRepository(GroupChatMessage)
    private readonly messageRepository: Repository<GroupChatMessage>
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
      .limit(15)
      .skip(offset)
      .getMany();
  }
}
