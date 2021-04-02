import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class AddMemberDto {
  @IsUUID(4, {
    message: "User must be type of uuid"
  })
  user: ID;
}
