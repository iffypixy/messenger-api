import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {OneToOneChatMemberPublicData} from "../lib/typings";
import {OneToOneChat} from "./one-to-one-chat.entity";

@Entity()
export class OneToOneChatMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @JoinColumn()
  @OneToOne(() => OneToOneChat, {
    cascade: true,
    eager: true,
    nullable: false
  })
  chat: OneToOneChat;

  @ManyToOne(() => User, {
    nullable: false,
    eager: true,
    cascade: true
  })
  user: User;

  @Column({
    type: "boolean",
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
