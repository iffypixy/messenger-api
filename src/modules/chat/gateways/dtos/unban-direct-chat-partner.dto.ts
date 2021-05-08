import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class UnbanDirectChatPartnerDto {
  @IsUUID(4)
  partner: ID;
}