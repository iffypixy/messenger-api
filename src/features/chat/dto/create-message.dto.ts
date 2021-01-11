import {IsOptional, IsString, MaxLength} from "class-validator";

import {ID} from "@lib/types";

export class CreateMessageDto {
  @IsString()
  @MaxLength(2048)
  text: string;

  @IsOptional()
  @IsString({
    each: true,
    message: "Audio id type must be string"
  })
  audioId: ID;

  @IsOptional()
  @IsString({
    each: true,
    message: "File id type must be string"
  })
  filesIds: ID[];

  @IsOptional()
  @IsString({
    each: true,
    message: "File id type must be string"
  })
  imagesIds: ID[];
}