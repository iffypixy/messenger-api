import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@features/user";

@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {length: 256})
  token: string;

  @Column("varchar", {length: 256})
  fingerprint: string;

  @ManyToOne(type => User, {eager: true})
  user: User;

  @Column("timestamp")
  expiresIn: Date;
}