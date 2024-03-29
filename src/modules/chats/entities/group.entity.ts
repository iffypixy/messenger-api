import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";

export interface GroupPublicData {
  id: ID;
  avatar: string;
  title: string;
}

const avatar = "https://messenger-bucket.s3.eu-central-1.amazonaws.com/499b1c41-61a3-4f24-b691-65efe35ddd35.png";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  @Column({
    type: "varchar",
    nullable: false,
    length: 128
  })
  title: string;

  @Column({
    type: "text",
    nullable: false,
    default: avatar
  })
  avatar: string;

  get public(): GroupPublicData {
    const {id, title, avatar} = this;

    return {id, title, avatar};
  }
}
