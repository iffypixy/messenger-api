import {IsNumber, IsOptional, IsUUID} from "class-validator";
import {ID} from "@lib/typings";

export class GetGroupChatAttachmentsDto {
  @IsUUID(4)
  group: ID;
}