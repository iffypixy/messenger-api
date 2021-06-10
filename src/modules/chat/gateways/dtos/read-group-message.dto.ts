import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class ReadGroupMessageDto {
  @IsUUID(4)
  group: ID;

  @IsUUID(4)
  message: ID;
}