import { User, UserPublicData } from "@modules/users";
import { ID } from "@lib/typings";
import { Group } from "./group.entity";
export declare type GroupChatMemberRole = "member" | "owner";
export interface GroupMemberPublicData extends UserPublicData {
    isOwner: boolean;
    isMember: boolean;
}
export declare class GroupMember {
    id: ID;
    user: User;
    chat: Group;
    role: GroupChatMemberRole;
    createdAt: Date;
    get isOwner(): boolean;
    get isMember(): boolean;
    get public(): GroupMemberPublicData;
}
