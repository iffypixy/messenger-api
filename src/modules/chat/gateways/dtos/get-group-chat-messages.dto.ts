import {IsNumber, IsOptional, IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetGroupChatMessagesDto {
  @IsUUID(4)
  group: ID;

  @IsOptional()
  @IsNumber({}, {
    message: "Skip must be type of number"
  })
  skip?: string;
}