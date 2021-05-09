import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {GroupChat} from "./group-chat.entity";
import {GroupChatMemberPublicData, GroupChatMemberRole} from "../lib/typings";
import {groupChatMemberRoles} from "../lib/group-chat-member-roles";

@Entity()
export class GroupChatMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
    cascade: true
  })
  user: User;

  @ManyToOne(() => GroupChat, {
    eager: true,
    nullable: false,
    cascade: true
  })
  chat: GroupChat;

  @Column({
    type: "enum",
    nullable: false,
    default: "member",
    enum: groupChatMemberRoles
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

  get public(): GroupChatMemberPublicData {
    return publicise(this);
  }
}

export const publicise = (member: GroupChatMember): GroupChatMemberPublicData => ({
  ...member.user.public,
  isOwner: member.isOwner,
  isMember: member.isMember
});
