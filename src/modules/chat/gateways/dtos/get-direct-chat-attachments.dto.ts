import {IsNumber, IsOptional, IsUUID} from "class-validator";
import {ID} from "@lib/typings";

export class GetDirectChatAttachmentsDto {
  @IsUUID(4)
  partner: ID;

  @IsOptional()
  @IsNumber({}, {
    message: "Skip must be type of number"
  })
  skip?: number;
}