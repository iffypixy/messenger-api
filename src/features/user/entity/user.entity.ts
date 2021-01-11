import {
  AfterLoad, BeforeInsert, AfterRemove, AfterUpdate, BeforeRemove, BeforeUpdate,
  Column, AfterInsert,
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

  @Column("boolean")
  online: boolean;

  @Column("timestamp")
  lastSeen: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  fullName: string;

  @BeforeRemove()
  @BeforeUpdate()
  @AfterUpdate()
  @AfterRemove()
  @BeforeInsert()
  @AfterInsert()
  @AfterLoad()
  getFullName(): void {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  public getPublicData(): UserPublicData {
    const {id, firstName, lastName, avatar, online, fullName} = this;

    return {id, firstName, lastName, avatar, online, fullName};
  }
}

export interface UserPublicData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  online: boolean;
}
