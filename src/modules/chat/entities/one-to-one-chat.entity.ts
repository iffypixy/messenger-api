import {Entity, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";

@Entity()
export class OneToOneChat {
  @PrimaryGeneratedColumn("uuid")
  id: ID;
}
