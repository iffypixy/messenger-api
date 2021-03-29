import {Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";
import {GroupChat} from "./group-chat.entity";

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
}
