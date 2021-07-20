import { ID } from "@lib/typings";
export interface UserPublicData {
    id: ID;
    username: string;
    avatar: string;
    lastSeen: Date;
}
