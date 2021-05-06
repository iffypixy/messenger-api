import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@modules/user";
import {ID} from "@lib/typings";

@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @ManyToOne(() => User, {
    nullable: false,
    eager: true,
    cascade: true
  })
  user: User;

  @Column({
    type: "varchar",
    nullable: false,
    length: 256
  })
  fingerprint: string;

  @Column({
    type: "uuid",
    nullable: false
  })
  token: string;

  @Column({
    type: "timestamp",
    nullable: false
  })
  expiresAt: Date;
}

