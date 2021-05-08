import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {DirectChatMemberPublicData} from "../lib/typings";
import {DirectChat} from "./direct-chat.entity";

@Entity()
export class DirectChatMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => DirectChat, {
    cascade: true,
    eager: true,
    nullable: false
  })
  chat: DirectChat;

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

  get public(): DirectChatMemberPublicData {
    const {user, isBanned} = this;

    return {
      ...user.public,
      isBanned
    };
  }
}
