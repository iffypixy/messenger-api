import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {length: 128, unique: true})
  email: string;

  @Column("varchar", {length: 256})
  firstName: string;

  @Column("varchar", {length: 256})
  lastName: string;

  @Column("varchar", {length: 256})
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public getPublicData(): UserPublicData {
    const {id, firstName, lastName} = this;

    return {
      id,
      firstName,
      lastName
    };
  }
}

export interface UserPublicData {
  id: number;
  firstName: string;
  lastName: string;
}
