import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class AddMemberDto {
  @IsUUID(4)
  memberId: ID;

  @IsUUID(4)
  groupId: ID;
}