import {IsUUID} from "class-validator";

import {ID} from "@lib/typings";

export class GetGroupChatDto {
  @IsUUID(4)
  chat: ID;
}