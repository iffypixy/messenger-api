import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class SubscribeGroupChatsDto {
  @IsUUID(4, {
    each: true
  })
  groups: ID[];
}