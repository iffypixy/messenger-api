import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class AddMemberDto {
  @IsUUID(4)
  member: ID;

  @IsUUID(4)
  group: ID;
}