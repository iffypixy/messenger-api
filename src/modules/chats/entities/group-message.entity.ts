import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, ManyToMany, JoinTable} from "typeorm";

import {File, FilePublicData} from "@modules/uploads";
import {ID} from "@lib/typings";
import {Group, GroupPublicData} from "./group.entity";
import {GroupMember, GroupMemberPublicData} from "./group-member.entity";

export interface GroupMessagePublicData {
  id: ID;
  text: string | null;
  sender: GroupMemberPublicData | null;
  isEdited: boolean;
  isRead: boolean;
  isSystem: boolean;
  chat: GroupPublicData;
  audio: string;
  images: string[];
  files: FilePublicData[];
  parent: GroupMessagePublicData | null;
  createdAt: Date;
}

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => GroupMember, {
    cascade: true,
    nullable: true,
    eager: true
  })
  sender: GroupMember;

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

  @ManyToOne(() => GroupMessage, {
    nullable: true,
    cascade: true
  })
  parent: GroupMessage;

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

  @ManyToOne(() => Group, {
    cascade: true,
    nullable: true,
    eager: true
  })
  chat: Group;

  @CreateDateColumn()
  createdAt: Date;

  get public(): GroupMessagePublicData {
    const {id, text, isRead, isEdited, chat, createdAt, isSystem, parent} = this;

    const sender = !isSystem ? this.sender.public : null;
    const audio = this.audio && this.audio.url;
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
      parent: parent && parent.public,
      chat: chat.public
    };
  }
}
