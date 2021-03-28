import {Entity, Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

import {User} from "@modules/user";
import {extensions} from "@lib/extensions";
import {FilePublicData} from "../lib/typings";

@Entity()
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    length: 128,
    nullable: false
  })
  name: string;

  @Column("int")
  size: number;

  @Column("enum", {
    enum: extensions.all,
    nullable: false
  })
  extension: string;

  @Column("varchar", {
    length: 1024,
    nullable: false
  })
  url: string;

  @ManyToOne(type => User, {
    nullable: false
  })
  user: User;

  get public(): FilePublicData {
    const {id, name, size, url} = this;

    return {id, name, size, url};
  }
}
