import {IsNumberString, IsOptional, IsUUID} from "class-validator";
import {ID} from "@lib/typings";

export class GetGroupChatAttachmentsDto {
  @IsUUID(4)
  chat: ID;

  @IsOptional()
  @IsNumberString({}, {
    message: "Skip must be type of number-string"
  })
  skip?: string;
}