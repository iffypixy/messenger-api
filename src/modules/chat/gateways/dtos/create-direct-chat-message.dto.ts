import {IsOptional, IsString, IsUUID, MaxLength} from "class-validator";

import {ID} from "@lib/typings";

export class CreateDirectChatMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  text?: string;

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "Audio must be type of uuid"
  })
  audio?: ID = null;

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "File must be type of uuid"
  })
  files?: ID[] = [];

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "Image must be type of uuid"
  })
  images?: ID[] = [];

  @IsOptional()
  @IsUUID("4", {
    message: "Parent must be type of uuid"
  })
  parent?: ID;

  @IsUUID(4)
  partner: ID;
}
