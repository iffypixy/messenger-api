import { ID } from "@lib/typings";
import { UserRole } from "../lib/user-roles";
export interface UserPublicData {
    id: ID;
    username: string;
    avatar: string;
    lastSeen: Date;
}
export declare class User {
    id: ID;
    username: string;
    password: string;
    avatar: string;
    role: UserRole;
    lastSeen: Date;
    createdAt: Date;
    get public(): UserPublicData;
}
