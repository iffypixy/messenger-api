import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

import {idleTime} from "@lib/constants";
import {UserPublicData} from "../lib/typings";
import {userRoles, isAdmin, UserRole} from "../lib/user-roles";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 25,
    unique: true,
    nullable: false
  })
  login: string;

  @Column("varchar", {
    length: 256,
    nullable: false
  })
  password: string;

  @Column("varchar", {
    length: 1024,
    nullable: false
  })
  avatar: string;

  @Column("enum", {
    enum: userRoles,
    nullable: false
  })
  role: UserRole;

  @Column("date", {
    nullable: true
  })
  lastSeen: Date;

  isOnline: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @AfterLoad()
  setIsOnline(): void {
    const diff = Date.now() - +this.lastSeen;

    if (diff <= idleTime) this.isOnline = true;
    else this.isOnline = false;
  }

  get public(): UserPublicData {
    const {id, login, avatar, isOnline} = this;

    return {id, login, avatar, isOnline};
  }

  get isAdmin(): boolean {
    return isAdmin(this.role);
  }
}
