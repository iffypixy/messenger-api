import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class AddGroupChatMemberDto {
  @IsUUID(4)
  member: ID;

  @IsUUID(4)
  chat: ID;
}