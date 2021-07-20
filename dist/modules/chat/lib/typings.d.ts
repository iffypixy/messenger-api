import { ID } from "@lib/typings";
import { UserPublicData } from "@modules/user";
import { FilePublicData } from "@modules/upload";
export interface GroupChatMemberPublicData extends UserPublicData {
    isOwner: boolean;
    isMember: boolean;
}
export interface AttachmentPublicData {
    id: ID;
    files: FilePublicData[] | null;
    images: {
        id: ID;
        url: string;
    }[] | null;
    audio: {
        id: ID;
        url: string;
    } | null;
}
export declare type AttachmentType = "audio" | "image" | "file";
export interface DirectChatPublicData {
    id: ID;
}
export interface GroupChatPublicData {
    id: ID;
    avatar: string;
    title: string;
}
export declare type ChatMessageSenderType = "user" | "system";
export declare type GroupChatMemberRole = "owner" | "member";
export interface GroupChatMessagePublicData {
    id: ID;
    text: string | null;
    sender: GroupChatMemberPublicData | null;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    chat: GroupChatPublicData;
    audio: string;
    images: string[];
    files: FilePublicData[];
    parent: GroupChatMessagePublicData | null;
    createdAt: Date;
}
export interface DirectChatMessagePublicData {
    id: ID;
    text: string;
    sender: DirectChatMemberPublicData | null;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    chat: DirectChatPublicData;
    audio: string;
    images: string[];
    files: FilePublicData[];
    parent: DirectChatMessagePublicData | null;
    createdAt: Date;
}
export interface DirectChatMemberPublicData extends UserPublicData {
    isBanned: boolean;
}
