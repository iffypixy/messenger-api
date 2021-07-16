import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User, UserPublicData} from "@modules/users";
import {ID} from "@lib/typings";
import {Direct} from "./direct.entity";

export interface DirectMemberPublicData extends UserPublicData {
  isBanned: boolean;
}

@Entity()
export class DirectMember {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => Direct, {
    cascade: true,
    eager: true,
    nullable: false
  })
  chat: Direct;

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

  get public(): DirectMemberPublicData {
    const {user, isBanned} = this;

    return {
      ...user.public, isBanned
    };
  }
}
