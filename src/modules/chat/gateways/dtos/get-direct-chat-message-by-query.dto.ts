import {IsNumberString, IsOptional, IsString, IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetDirectChatMessageByQueryDto {
  @IsUUID(4)
  partner: ID;

  @IsString({
    message: "Query must be type of string"
  })
  query: string;

  @IsOptional()
  @IsNumberString({}, {
    message: "Skip must be type of number-string"
  })
  skip?: string;
}