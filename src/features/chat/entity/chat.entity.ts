import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";

import {User, UserPublicData} from "@features/user";
import {ID} from "@lib/types";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column("varchar", {length: 256, nullable: true})
  title: string | null;

  @Column("varchar", {length: 256, nullable: true})
  avatar: string;

  @Column("enum", {enum: ["dialog", "discussion"]})
  type: "dialog" | "discussion";

  @CreateDateColumn()
  createdAt: string;

  getDiscussionPublicData(): DiscussionPublicData {
    const {id, title, avatar, members} = this;

    return {
      id, title, avatar,
      members: members.map((member) => member.getPublicData())
    };
  }

  getDialogPublicData(userId: ID): DialogPublicData {
    const {id, members} = this;

    const companion = members.find(({id}) => id !== userId);

    return {
      id, companion: companion && companion.getPublicData()
    };
  }
}

export interface DialogPublicData {
  id: string;
  companion: UserPublicData;
}

export interface DiscussionPublicData {
  id: ID;
  members: UserPublicData[];
  title: string;
  avatar: string;
}