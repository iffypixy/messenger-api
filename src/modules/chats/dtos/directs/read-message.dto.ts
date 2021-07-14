import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class ReadMessageDto {
  @IsUUID(4)
  partner: ID;

  @IsUUID(4)
  message: ID;
}