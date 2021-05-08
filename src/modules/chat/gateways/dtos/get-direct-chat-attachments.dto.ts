import {IsNumberString, IsOptional, IsUUID} from "class-validator";
import {ID} from "@lib/typings";

export class GetDirectChatAttachmentsDto {
  @IsUUID(4)
  partner: ID;

  @IsOptional()
  @IsNumberString({}, {
    message: "Skip must be type of number-string"
  })
  skip?: string;
}