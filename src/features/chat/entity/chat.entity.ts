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
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[] | number[];

  @Column({
    enum: ["dialog", "discussion"]
  })
  type: string;

  @Column("varchar", {
    length: 256,
    nullable: true
  })
  title: string;

  @Column("varchar", {
    length: 256,
    nullable: true
  })
  image: string; 

  @CreateDateColumn()
  createdAt: Date;

  getPublicData(userId: string): DialogPublicData {
    const {id, members} = this;

    const companion = (members as User[]).find(member => member.id !== userId);

    return {
      id,
      companion: companion.getPublicData()
    };
  }
}

export interface DialogPublicData {
  id: string;
  companion: UserPublicData;
}

export interface DiscussionPublicData {
  id: string;
  members: UserPublicData[];
  image: string;
  title: string;
}
