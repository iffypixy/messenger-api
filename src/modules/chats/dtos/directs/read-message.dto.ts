import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class ReadMessageDto {
  @IsUUID(4)
  partnerId: ID;

  @IsUUID(4)
  messageId: ID;
}