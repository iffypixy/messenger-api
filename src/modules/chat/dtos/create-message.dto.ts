import {IsOptional, IsString, IsUUID, MaxLength} from "class-validator";

import {ID} from "@lib/typings";

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  text: string;

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "Audio must be type of uuid"
  })
  audio: ID = null;

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "File must be type of uuid"
  })
  files: ID[] = [];

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "Image must be type of uuid"
  })
  images: ID[] = [];

  @IsOptional()
  @IsUUID("4", {
    message: "Message it replies to must be type of uuid"
  })
  replyTo: ID;
}
