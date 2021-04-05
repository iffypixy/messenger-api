import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {OneToOneChat} from "./one-to-one-chat.entity";
import {OneToOneChatMemberPublicData} from "../lib/typings";

@Entity()
export class OneToOneChatMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(type => OneToOneChat, {eager: true})
  chat: OneToOneChat;

  @ManyToOne(type => User, {eager: true})
  user: User;

  @Column("boolean", {
    nullable: false,
    default: false
  })
  isBanned: boolean;

  get public(): OneToOneChatMemberPublicData {
    const {user, isBanned} = this;

    return {
      ...user.public,
      isBanned
    };
  }
}
