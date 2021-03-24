import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get public(): UserPublicData {
    const {id, login, avatar} = this;

    return {id, login, avatar};
  }

  get isAdmin(): boolean {
    return isAdmin(this.role);
  }
}
