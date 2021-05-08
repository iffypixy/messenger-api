import {IsNumberString, IsOptional, IsUUID} from "class-validator";
import {ID} from "@lib/typings";

export class CreateGroupChatDto {
  @IsUUID(4, {
    each: true
  })
  members: ID[];

  @IsOptional()
  @IsNumberString({}, {
    message: "Title must be type of string"
  })
  title?: string;

  @IsOptional()
  @IsUUID(4)
  avatar?: string;
}