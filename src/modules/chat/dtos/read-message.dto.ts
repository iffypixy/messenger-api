import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class ReadMessageDto {
  @IsUUID(4, {
    message: "Message must be type of uuid"
  })
  message: ID;
}
