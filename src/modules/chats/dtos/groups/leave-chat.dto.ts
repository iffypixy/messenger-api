import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class LeaveChatDto {
  @IsUUID(4)
  group: ID;
}