import {IsOptional, IsString, IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class CreateGroupChatDto {
  @IsOptional()
  @IsString({message: "Title must be type of string"})
  title?: string;

  @IsUUID(4, {
    each: true
  })
  members: ID[];
}
