import {IsNumberString, IsOptional, IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetDirectChatMessagesDto {
  @IsUUID(4)
  partner: ID;

  @IsOptional()
  @IsNumberString({}, {
    message: "Skip must be type of number-string"
  })
  skip?: string;
}