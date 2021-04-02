import {ID} from "@lib/typings";

export interface UserPublicData {
  id: ID;
  login: string;
  avatar: string;
  isOnline: boolean;
}
