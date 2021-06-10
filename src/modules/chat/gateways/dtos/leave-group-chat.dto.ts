import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class LeaveGroupChatDto {
  @IsUUID(4)
  group: ID;
}