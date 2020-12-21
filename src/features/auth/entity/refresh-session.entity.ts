import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@features/user";

@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {length: 256})
  token: string;

  @Column("varchar", {length: 256})
  fingerprint: string;

  @OneToOne(type => User, {eager: true})
  @JoinColumn()
  user: User;

  @Column("timestamp")
  expiresIn: Date;
}