import { File } from "@modules/upload";
import { ID } from "@lib/typings";
import { GroupChat } from "./group-chat.entity";
import { GroupChatMember } from "./group-chat-member.entity";
import { GroupChatMessagePublicData } from "../lib/typings";
export declare class GroupChatMessage {
    id: ID;
    sender: GroupChatMember;
    text: string;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    parent: GroupChatMessage;
    files: File[];
    images: File[];
    audio: File;
    chat: GroupChat;
    createdAt: Date;
    get public(): GroupChatMessagePublicData;
}
