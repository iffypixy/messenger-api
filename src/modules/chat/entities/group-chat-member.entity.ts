import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column
} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {GroupChat} from "./group-chat.entity";
import {groupChatMemberRoles} from "../lib/group-chat-member-roles";
import {GroupChatMemberRole} from "../lib/typings";

@Entity()
export class GroupChatMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @JoinColumn()
  @ManyToOne(type => User, {
    eager: true
  })
  user: User;

  @ManyToOne(type => GroupChat, {
    eager: true
  })
  chat: GroupChat;

  @Column("enum", {
    nullable: true,
    enum: groupChatMemberRoles
  })
  role: GroupChatMemberRole;

  get public() {
    const {user, role} = this;

    return {
      ...user.public,
      isOwner: role === "owner",
      isMember: role === "member"
    };
  }

  get isOwner(): boolean {
    return this.role === "owner";
  }
}
