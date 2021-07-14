import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class SubscribeChatsDto {
  @IsUUID(4, {
    each: true
  })
  groups: ID[];
}