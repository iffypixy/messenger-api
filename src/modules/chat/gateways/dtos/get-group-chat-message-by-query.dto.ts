import {IsNumberString, IsOptional, IsString, IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetGroupChatMessageByQueryDto {
  @IsUUID(4)
  chat: ID;

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