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
import {File, FilePublicData} from "@modules/uploads";
import {Direct, DirectPublicData} from "./direct.entity";
import {DirectMember, DirectMemberPublicData} from "./direct-member.entity";

export interface DirectMessagePublicData {
  id: ID;
  text: string;
  sender: DirectMemberPublicData | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  chat: DirectPublicData;
  audio: string;
  images: string[];
  files: FilePublicData[];
  parent: DirectMessagePublicData | null;
  createdAt: Date;
}

@Entity()
export class DirectMessage {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => DirectMember, {
    eager: true,
    nullable: true,
    cascade: true
  })
  sender: DirectMember;

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

  @ManyToOne(() => DirectMessage, {
    nullable: true,
    cascade: true
  })
  parent: DirectMessage;

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

  @ManyToOne(() => Direct, {
    eager: true,
    nullable: false
  })
  chat: Direct;

  @CreateDateColumn()
  createdAt: Date;

  get public(): DirectMessagePublicData {
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
