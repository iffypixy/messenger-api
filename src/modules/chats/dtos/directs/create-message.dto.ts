import {IsOptional, IsString, IsUUID, MaxLength} from "class-validator";

import {ID} from "@lib/typings";

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  text?: string;

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "Audio must be type of uuid"
  })
  audioId?: ID = null;

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "File must be type of uuid"
  })
  filesIds?: ID[] = [];

  @IsOptional()
  @IsUUID("4", {
    each: true,
    message: "Image must be type of uuid"
  })
  imagesIds?: ID[] = [];

  @IsOptional()
  @IsUUID("4", {
    message: "Parent must be type of uuid"
  })
  parentId?: ID;

  @IsUUID(4)
  partnerId: ID;
}
