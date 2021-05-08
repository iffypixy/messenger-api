import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class BanDirectChatPartnerDto {
  @IsUUID(4)
  partner: ID;
}