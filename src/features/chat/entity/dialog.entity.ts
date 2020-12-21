import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable
} from "typeorm";

import {User, UserPublicData} from "@features/user";
import {DialogMessagePublicData} from "./dialog-message.entity";

@Entity()
export class Dialog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  public getPublicData(userId: number): DialogPublicData {
    const {id, members} = this;

    const companion = members.find(member => member.id !== userId);

    return {
      id,
      companion: companion.getPublicData()
    };
  }
}

export interface DialogPublicData {
  id: number;
  companion: UserPublicData;
  latestMessage?: DialogMessagePublicData;
}
