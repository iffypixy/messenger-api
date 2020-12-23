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
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  createdAt: Date;

  getPublicData(): MessagePublicData {
    const {id, sender, text, attachments, createdAt} = this;

    return {
      id, text, createdAt,
      sender: sender.getPublicData(),
      attachments: attachments.getPublicData()
    };
  }
}

export interface MessagePublicData {
  id: number;
  sender: UserPublicData;
  text: string;
  attachments: AttachmentsPublicData;
  createdAt: Date;
}
