import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, ManyToMany} from "typeorm";

import {File} from "@modules/upload";
import {ID} from "@lib/typings";
import {GroupChat} from "./group-chat.entity";
import {GroupChatMember} from "./group-chat-member.entity";
import {GroupChatMessagePublicData} from "../lib/typings";

@Entity()
export class GroupChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => GroupChatMember, {
    cascade: true,
    nullable: true,
    eager: true
  })
  sender: GroupChatMember;

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

  @ManyToOne(() => GroupChatMessage, {
    nullable: true,
    cascade: true
  })
  parent: GroupChatMessage;

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

  @ManyToOne(() => GroupChat, {
    cascade: true,
    nullable: true,
    eager: true
  })
  chat: GroupChat;

  @CreateDateColumn()
  createdAt: Date;

  get public(): GroupChatMessagePublicData {
    const {id, text, isRead, isEdited, chat, createdAt, isSystem, parent} = this;

    const sender = !isSystem ? this.sender.public : null;

    return {
      id,
      text,
      sender,
      isEdited,
      isRead,
      createdAt,
      isSystem,
      parent: parent && parent.public,
      chat: chat.public
    };
  }
}
