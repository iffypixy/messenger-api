import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {length: 128, unique: true})
  email: string;

  @Column("varchar", {length: 256})
  firstName: string;

  @Column("varchar", {length: 256})
  lastName: string;

  @Column("varchar", {length: 256})
  password: string;

  @Column("varchar", {length: 256})
  avatar: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  public getPublicData(): UserPublicData {
    const {id, firstName, lastName, avatar} = this;

    return {id, firstName, lastName, avatar,};
  }
}

export interface UserPublicData {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}
