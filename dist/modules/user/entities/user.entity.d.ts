import { ID } from "@lib/typings";
import { UserPublicData } from "../lib/typings";
import { UserRole } from "../lib/user-roles";
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
export declare const publicise: (user: User) => UserPublicData;
