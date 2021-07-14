import {Entity, PrimaryGeneratedColumn} from "typeorm";

import {ID} from "@lib/typings";

export interface DirectPublicData {
  id: ID;
}

@Entity()
export class Direct {
  @PrimaryGeneratedColumn("uuid")
  id: ID;

  get public(): DirectPublicData {
    const {id} = this;

    return {
      id
    };
  }
}
