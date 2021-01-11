import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/types";
import {User, UserPublicData} from "@features/user";

import {Attachment, AttachmentPublicData} from "./attachment.entity";
import {Chat} from "./chat.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(type => User)
  @JoinColumn()
  sender: User;

  @Column("text", {
    nullable: true
  })
  text: string;

  @Column("boolean")
  read: boolean;

  @Column(type => Attachment)
  attachment: Attachment;

  @ManyToOne(type => Chat)
  chat: Chat;

  @CreateDateColumn()
  createdAt: string;

  getPublicData(): MessagePublicData {
    const {id, sender, text, read, attachment, chat, createdAt} = this;

    return {
      id, text, read, createdAt,
      attachment: attachment && attachment.getPublicData(),
      sender: sender && sender.getPublicData(),
      chatId: chat.id
    };
  }
}

export interface MessagePublicData {
  id: ID;
  text: string | null;
  sender: UserPublicData;
  attachment: AttachmentPublicData | null;
  read: boolean;
  chatId: ID;
  createdAt: string;
}
