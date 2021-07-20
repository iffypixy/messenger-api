import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";
import {UserRole, userRoles} from "../lib/user-roles";

export interface UserPublicData {
  id: ID;
  username: string;
  avatar: string;
  lastSeen: Date;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true,
    length: 24
  })
  username: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 256
  })
  password: string;

  @Column({
    type: "text",
    nullable: false
  })
  avatar: string;

  @Column({
    type: "enum",
    nullable: false,
    default: "user",
    enum: userRoles
  })
  role: UserRole;

  @Column({
    type: "timestamp",
    nullable: false
  })
  lastSeen: Date;

  @CreateDateColumn()
  createdAt: Date;

  get public(): UserPublicData {
    const {id, username, avatar, lastSeen} = this;

    return {id, username, lastSeen, avatar};
  }
}
