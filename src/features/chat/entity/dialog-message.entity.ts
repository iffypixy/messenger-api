import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import {UserPublicData, User} from "@features/user";
import {Dialog} from "./dialog.entity";
import {Attachment, AttachmentPublicData} from "./attachment";

@Entity()
export class DialogMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  @JoinColumn()
  sender: User;

  @Column("varchar", {
    nullable: true
  })
  text: string;

  @Column(type => Attachment)
  attachment: Attachment;

  @ManyToOne(type => Dialog)
  dialog: Dialog;

  @CreateDateColumn()
  createdAt: Date;

  public getPublicData(): DialogMessagePublicData {
    const {id, sender, text, attachment, createdAt} = this;

    return {
      id,
      sender: sender.getPublicData(),
      text,
      attachment,
      createdAt
    };
  }
}

export interface DialogMessagePublicData {
  id: number;
  sender: UserPublicData;
  text: string;
  attachment: AttachmentPublicData;
  createdAt: Date;
}
