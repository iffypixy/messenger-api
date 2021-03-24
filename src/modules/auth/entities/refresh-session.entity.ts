import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from "typeorm";

import {User} from "@modules/user";

@Entity()
export class RefreshSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, {
    nullable: false,
    eager: true
  })
  user: User;

  @Column({
    type: "varchar",
    nullable: false,
    length: 100
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
