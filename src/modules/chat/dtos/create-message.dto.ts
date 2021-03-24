import {IsOptional, IsString, MaxLength} from "class-validator";

import {ID} from "@lib/typings";

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  text: string;

  @IsOptional()
  @IsString({
    each: true,
    message: "Audio must be type of string"
  })
  audio: ID = null;

  @IsOptional()
  @IsString({
    each: true,
    message: "File must be type of string"
  })
  files: ID[] = [];

  @IsOptional()
  @IsString({
    each: true,
    message: "Image must be type of string"
  })
  images: ID[] = [];
}
