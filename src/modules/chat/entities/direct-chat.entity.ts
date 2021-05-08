import {Entity, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";
import {DirectChatPublicData} from "../lib/typings";

@Entity()
export class DirectChat {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  get public(): DirectChatPublicData {
    const {id} = this;

    return {
      id
    };
  }
}
