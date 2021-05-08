import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetDirectChatDto {
  @IsUUID(4)
  partner: ID;
}