import {IsNumber, IsOptional, IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetMessagesDto {
  @IsOptional()
  @IsNumber({}, {
    message: "Skip must be type of number"
  })
  skip: number;
}