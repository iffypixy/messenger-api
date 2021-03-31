import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Tree,
  TreeChildren
} from "typeorm";

import {ID} from "@lib/typings";
import {Attachment} from "./attachment.entity";
import {GroupChat} from "./group-chat.entity";
import {GroupChatMember} from "./group-chat-member.entity";
import {chatMessageSenderTypes} from "../lib/chat-message-sender-type";
import {ChatMessageSenderType, ChatMessagePublicData} from "../lib/typings";

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

  @Column("json", {
    nullable: true
  })
  status: {
    isEdited: boolean;
    isRead: boolean;
  };

  @TreeChildren()
  @ManyToOne(type => GroupChatMessage, {
    eager: true
  })
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

  get public(): ChatMessagePublicData {
    const {id, text, status, chat, createdAt} = this;

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
      audio: attachment && attachment.audio,
      images: attachment && attachment.images,
      files: attachment && attachment.files,
      chatId
    };
  }
}
