import {Entity, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";
import {OneToOneChatPublicData} from "../lib/typings";

@Entity()
export class OneToOneChat {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  get public(): OneToOneChatPublicData {
    const {id} = this;

    return {
      id
    };
  }
}
