import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class DeleteMessagesDto {
  @IsUUID("4", {
    each: true,
    message: "Invalid message id"
  })
  messages: ID[];
}
