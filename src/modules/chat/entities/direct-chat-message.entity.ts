import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import {ID} from "@lib/typings";
import {File} from "@modules/upload";
import {DirectChatMessagePublicData} from "../lib/typings";
import {DirectChat} from "./direct-chat.entity";
import {DirectChatMember} from "./direct-chat-member.entity";

@Entity()
export class DirectChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => DirectChatMember, {
    eager: true,
    nullable: true,
    cascade: true
  })
  sender: DirectChatMember;

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

  @ManyToOne(() => DirectChatMessage, {
    nullable: true,
    cascade: true
  })
  parent: DirectChatMessage;

  @JoinTable()
  @ManyToMany(() => File, {
    eager: true,
    nullable: true
  })
  files: File[];

  @JoinTable()
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

  @ManyToOne(() => DirectChat, {
    eager: true,
    nullable: false
  })
  chat: DirectChat;

  @CreateDateColumn()
  createdAt: Date;

  get public(): DirectChatMessagePublicData {
    const {id, text, isRead, isEdited, createdAt, chat, isSystem, parent} = this;

    const sender = !isSystem ? this.sender.public : null;
    const audio = this.audio ? this.audio.url : null;
    const images = (this.images && !!this.images.length) ? this.images.map(({url}) => url) : null;
    const files = (this.files && !!this.files.length) ? this.files.map((file) => file.public) : null;

    return {
      id,
      text,
      sender,
      isEdited,
      isRead,
      createdAt,
      isSystem,
      audio, images, files,
      chat: chat.public,
      parent: parent && parent.public
    };
  }
}
