import { File, FilePublicData } from "@modules/upload";
import { ID } from "@lib/typings";
import { Group, GroupPublicData } from "./group.entity";
import { GroupMember, GroupMemberPublicData } from "./group-member.entity";
export interface GroupMessagePublicData {
    id: ID;
    text: string | null;
    sender: GroupMemberPublicData | null;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    chat: GroupPublicData;
    audio: string;
    images: string[];
    files: FilePublicData[];
    parent: GroupMessagePublicData | null;
    createdAt: Date;
}
export declare class GroupMessage {
    id: ID;
    sender: GroupMember;
    text: string;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    parent: GroupMessage;
    files: File[];
    images: File[];
    audio: File;
    chat: Group;
    createdAt: Date;
    get public(): GroupMessagePublicData;
}
