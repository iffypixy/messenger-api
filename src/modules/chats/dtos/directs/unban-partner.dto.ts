import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class UnbanPartnerDto {
  @IsUUID(4)
  partner: ID;
}