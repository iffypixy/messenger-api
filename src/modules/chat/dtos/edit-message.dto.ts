import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";
import {CreateMessageDto} from "./create-message.dto";

export class EditMessageDto extends CreateMessageDto {
  @IsUUID(4, {
    message: "Message must be type of uuid"
  })
  message: ID;
}
