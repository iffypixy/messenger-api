import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class BanPartnerDto {
  @IsUUID(4)
  partnerId: ID;
}