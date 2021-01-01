import {Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, Column} from "typeorm";

import {User, UserPublicData} from "@features/user";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column({
    enum: ["dialog", "discussion"]
  })
  type: "dialog" | "discussion";

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
  createdAt: string;

  getDialogPublicData(userId: string): DialogPublicData {
    const companion = this.members.find(member => member.id !== userId);

    return {
      id: this.id,
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
