import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from "typeorm";

import {ID} from "@lib/typings";
import {Attachment} from "./attachment";
import {OneToOneChat} from "./one-to-one-chat.entity";
import {OneToOneChatMember} from "./one-to-one-chat-member.entity";
import {ChatMessagePublicData} from "../lib/typings";
import {
  chatMessageSenderTypes,
  ChatMessageSenderType
} from "../lib/chat-message-sender-type";

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

  @Column(type => Attachment)
  attachment: Attachment;

  @ManyToOne(type => OneToOneChat, {
    eager: true
  })
  chat: OneToOneChat;

  @CreateDateColumn()
  createdAt: string;

  get public(): ChatMessagePublicData {
    const {id, text, status, createdAt, attachment} = this;

    const isSystem = this.sender.type === "system";
    const isEdited = (status && status.isEdited) || false;
    const isRead = (status && status.isRead) || false;
    const sender = !isSystem ? this.sender.member.user.public : null;
    const files =
      (attachment.files.length > 0 &&
        attachment.files.map(file => file.public)) ||
      null;
    const images =
      (attachment.images.length > 0 && attachment.images.map(({url}) => url)) ||
      null;
    const audio = attachment.audio && attachment.audio.url;

    return {
      id,
      text,
      sender,
      isEdited,
      isRead,
      createdAt,
      isSystem,
      files,
      images,
      audio
    };
  }
}
