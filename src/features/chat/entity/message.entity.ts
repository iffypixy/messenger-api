import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import {UserPublicData, User} from "@features/user";
import {Chat} from "./chat.entity";
import {Attachments, AttachmentsPublicData} from "./attachments";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(type => User)
  @JoinColumn()
  sender: User;

  @Column("varchar", {
    nullable: true
  })
  text: string;

  @Column(type => Attachments)
  attachments: Attachments;

  @ManyToOne(type => Chat)
  chat: Chat;

  @Column("boolean")
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  getPublicData(): MessagePublicData {
    const {id, sender, text, attachments, createdAt, isRead} = this;

    return {
      id, text, createdAt,
      isRead,
      sender: sender.getPublicData(),
      attachments: attachments?.getPublicData()
    };
  }
}

export interface MessagePublicData {
  id: string;
  sender: UserPublicData;
  text: string;
  attachments: AttachmentsPublicData;
  isRead: boolean;
  createdAt: Date;
}
