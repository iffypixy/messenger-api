import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  Column
} from "typeorm";

import {User, UserPublicData} from "@features/user";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column({
    enum: ["dialog", "discussion"]
  })
  type: string;

  @Column("varchar", {
    length: 256
  })
  title: string;

  @Column("varchar", {
    length: 256
  })
  image: string; 

  @CreateDateColumn()
  createdAt: Date;

  getPublicData(userId: number): DialogPublicData {
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
}

export interface DiscussionPublicData {
  id: number;
  members: UserPublicData[];
  image: string;
  title: string;
}
