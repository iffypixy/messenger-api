import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class ReadDirectMessageDto {
  @IsUUID(4)
  partner: ID;

  @IsUUID(4)
  message: ID;
}