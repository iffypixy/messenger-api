import {IsOptional, IsString} from "class-validator";

import {ID} from "@lib/types";

export class CreateDiscussionDto {
  @IsString({
    each: true
  })
  membersIds: ID[];

  @IsOptional()
  @IsString({
    message: "Title type must be a string"
  })
  title: string;
}