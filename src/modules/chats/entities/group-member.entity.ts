import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User, UserPublicData} from "@modules/users";
import {ID} from "@lib/typings";
import {Group} from "./group.entity";

export type GroupChatMemberRole = "member" | "owner";

export interface GroupMemberPublicData extends UserPublicData {
  isOwner: boolean;
  isMember: boolean;
}

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
    cascade: true
  })
  user: User;

  @ManyToOne(() => Group, {
    eager: true,
    nullable: false,
    cascade: true
  })
  chat: Group;

  @Column({
    type: "enum",
    nullable: false,
    default: "member",
    enum: ["member", "owner"]
  })
  role: GroupChatMemberRole;

  @CreateDateColumn()
  createdAt: Date;

  get isOwner(): boolean {
    return this.role === "owner";
  }

  get isMember(): boolean {
    return this.role === "member";
  }

  get public(): GroupMemberPublicData {
    const {user, isMember, isOwner} = this;

    return {
      ...user.public,
      isOwner, isMember
    };
  }
}
