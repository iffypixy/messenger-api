import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn
} from "typeorm";

import {ID} from "@lib/typings";
import {Attachment} from "./attachment.entity";
import {OneToOneChat} from "./one-to-one-chat.entity";
import {OneToOneChatMember} from "./one-to-one-chat-member.entity";
import {chatMessageSenderTypes} from "../lib/chat-message-sender-type";
import {ChatMessagePublicData, ChatMessageSenderType} from "../lib/typings";

class Sender {
  @Column("enum", {
    enum: chatMessageSenderTypes
  })
  type: ChatMessageSenderType;

  @ManyToOne(type => OneToOneChatMember, {eager: true})
  member: OneToOneChatMember;
}

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

  @Column("json", {
    nullable: true
  })
  status: {
    isEdited: boolean;
    isRead: boolean;
  };

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

  get public(): ChatMessagePublicData {
    const {id, text, status, createdAt, chat} = this;

    const isSystem = this.sender.type === "system";
    const isEdited = (status && status.isEdited) || false;
    const isRead = (status && status.isRead) || false;
    const sender = !isSystem ? this.sender.member.user.public : null;
    const chatId = chat.id;

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
      files: attachment && attachment.files,
      images: attachment && attachment.images,
      audio: attachment && attachment.audio
    };
  }
}
