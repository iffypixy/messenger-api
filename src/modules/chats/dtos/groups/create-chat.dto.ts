import {IsOptional, IsString, IsUUID} from "class-validator";
import {ID} from "@lib/typings";

export class CreateChatDto {
  @IsUUID(4, {
    each: true
  })
  membersIds: ID[];

  @IsOptional()
  @IsString({
    message: "Title must be type of string"
  })
  title?: string;

  @IsOptional()
  @IsUUID(4)
  avatarId?: string;
}