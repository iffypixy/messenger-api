import { User } from "@modules/user";
import { ID } from "@lib/typings";
import { GroupChat } from "./group-chat.entity";
import { GroupChatMemberPublicData, GroupChatMemberRole } from "../lib/typings";
export declare class GroupChatMember {
    id: ID;
    user: User;
    chat: GroupChat;
    role: GroupChatMemberRole;
    createdAt: Date;
    get isOwner(): boolean;
    get isMember(): boolean;
    get public(): GroupChatMemberPublicData;
}
export declare const publicise: (member: GroupChatMember) => GroupChatMemberPublicData;
