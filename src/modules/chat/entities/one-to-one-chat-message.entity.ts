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
import {OneToOneChat} from "./one-to-one-chat.entity";
import {OneToOneChatMember} from "./one-to-one-chat-member.entity";
import {chatMessageSenderTypes} from "../lib/chat-message-sender-type";
import {
  ChatMessageSenderType,
  OneToOneChatMessagePublicData
} from "../lib/typings";

class Sender {
  @Column("enum", {
    enum: chatMessageSenderTypes
  })
  type: ChatMessageSenderType;

  @ManyToOne(type => OneToOneChatMember, {eager: true})
  member: OneToOneChatMember;
}

@Tree("closure-table")
@Entity()
export class OneToOneChatMessage {
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
  replyTo: OneToOneChatMessage;

  @ManyToOne(type => OneToOneChat, {
    eager: true
  })
  chat: OneToOneChat;

  @JoinColumn()
  @OneToOne(type => Attachment, {
    eager: true
  })
  attachment: Attachment;

  @CreateDateColumn()
  createdAt: Date;

  get public(): OneToOneChatMessagePublicData {
    const {id, text, isRead, isEdited, createdAt, chat} = this;

    const isSystem = this.sender.type === "system";
    const sender = !isSystem ? this.sender.member.public : null;
    const chatId = chat.id;
    const replyTo = this.replyTo && this.replyTo.public;

    const attachment = this.attachment && this.attachment.public;

    return {
      id,
      text,
      sender,
      isEdited,
      isRead,
      createdAt,
      isSystem,
      chatId,
      replyTo,
      files: attachment && attachment.files,
      images: attachment && attachment.images,
      audio: attachment && attachment.audio
    };
  }
}
