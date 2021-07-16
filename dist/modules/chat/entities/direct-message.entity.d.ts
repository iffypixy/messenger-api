import { ID } from "@lib/typings";
import { File, FilePublicData } from "@modules/upload";
import { Direct, DirectPublicData } from "./direct.entity";
import { DirectMember, DirectMemberPublicData } from "./direct-member.entity";
export interface DirectMessagePublicData {
    id: ID;
    text: string;
    sender: DirectMemberPublicData | null;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    chat: DirectPublicData;
    audio: string;
    images: string[];
    files: FilePublicData[];
    parent: DirectMessagePublicData | null;
    createdAt: Date;
}
export declare class DirectMessage {
    id: ID;
    sender: DirectMember;
    text: string;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    parent: DirectMessage;
    files: File[];
    images: File[];
    audio: File;
    chat: Direct;
    createdAt: Date;
    get public(): DirectMessagePublicData;
}
