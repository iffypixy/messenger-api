import {Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {OneToOneChat} from "./one-to-one-chat.entity";

@Entity()
export class OneToOneChatMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(type => OneToOneChat, {eager: true})
  chat: OneToOneChat;

  @ManyToOne(type => User, {eager: true})
  user: User;
}
