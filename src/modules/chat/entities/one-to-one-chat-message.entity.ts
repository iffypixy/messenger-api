import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";
import {File} from "@modules/upload";
import {OneToOneChatMessagePublicData} from "../lib/typings";
import {OneToOneChat} from "./one-to-one-chat.entity";
import {OneToOneChatMember} from "./one-to-one-chat-member.entity";

@Entity()
export class OneToOneChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => OneToOneChatMember, {
    eager: true,
    nullable: true,
    cascade: true
  })
  sender: OneToOneChatMember;

  @Column({
    type: "text",
    nullable: true
  })
  text: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: false
  })
  isEdited: boolean;

  @Column({
    type: "boolean",
    nullable: false,
    default: false
  })
  isRead: boolean;

  @Column({
    type: "boolean",
    nullable: false,
    default: false
  })
  isSystem: boolean;

  @ManyToOne(() => OneToOneChatMessage, {
    nullable: true,
    cascade: true
  })
  parent: OneToOneChatMessage;

  @ManyToMany(() => File, {
    eager: true,
    nullable: true
  })
  files: File[];

  @ManyToMany(() => File, {
    eager: true,
    nullable: true
  })
  images: File[];

  @ManyToOne(() => File, {
    eager: true,
    nullable: true
  })
  audio: File;

  @ManyToOne(() => OneToOneChat)
  chat: OneToOneChat;

  @CreateDateColumn()
  createdAt: Date;

  get public(): OneToOneChatMessagePublicData {
    const {id, text, isRead, isEdited, createdAt, chat, isSystem, parent} = this;

    const sender = !isSystem ? this.sender.public : null;

    return {
      id,
      text,
      sender,
      isEdited,
      isRead,
      createdAt,
      isSystem,
      chat: chat.public,
      parent: parent && parent.public
    };
  }
}
