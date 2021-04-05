import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Tree,
  TreeParent
} from "typeorm";

import {ID} from "@lib/typings";
import {Attachment} from "./attachment.entity";
import {GroupChat} from "./group-chat.entity";
import {GroupChatMember} from "./group-chat-member.entity";
import {chatMessageSenderTypes} from "../lib/chat-message-sender-type";
import {
  ChatMessageSenderType,
  GroupChatMessagePublicData
} from "../lib/typings";

class Sender {
  @Column("enum", {
    enum: chatMessageSenderTypes
  })
  type: ChatMessageSenderType;

  @ManyToOne(type => GroupChatMember, {
    eager: true
  })
  member: GroupChatMember;
}

@Tree("closure-table")
@Entity()
export class GroupChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @Column(type => Sender)
  sender: Sender;

  @Column("varchar", {
    nullable: true
  })
  text: string;

  @Column("boolean", {
    nullable: false,
    default: false
  })
  isEdited: boolean;

  @Column("boolean", {
    nullable: false,
    default: false
  })
  isRead: boolean;

  @TreeParent()
  replyTo: GroupChatMessage;

  @ManyToOne(type => GroupChat, {
    eager: true
  })
  chat: GroupChat;

  @JoinColumn()
  @OneToOne(type => Attachment, {
    eager: true
  })
  attachment: Attachment;

  @CreateDateColumn()
  createdAt: Date;

  get public(): GroupChatMessagePublicData {
    const {id, text, isRead, isEdited, chat, createdAt} = this;

    const isSystem = this.sender.type === "system";
    const sender = !isSystem ? this.sender.member.public : null;
    const chatId = chat.id;
    const replyTo = (this.replyTo && this.replyTo.public) || null;

    const attachment = this.attachment && this.attachment.public;
    const audio = attachment && attachment.audio;
    const images = attachment && attachment.images;
    const files = attachment && attachment.files;

    return {
      id,
      text,
      sender,
      isEdited,
      isRead,
      createdAt,
      isSystem,
      replyTo,
      audio,
      images,
      files,
      chatId
    };
  }
}
