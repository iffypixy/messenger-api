import { ID } from "@lib/typings";
import { File } from "@modules/upload";
import { DirectChatMessagePublicData } from "../lib/typings";
import { DirectChat } from "./direct-chat.entity";
import { DirectChatMember } from "./direct-chat-member.entity";
export declare class DirectChatMessage {
    id: ID;
    sender: DirectChatMember;
    text: string;
    isEdited: boolean;
    isRead: boolean;
    isSystem: boolean;
    parent: DirectChatMessage;
    files: File[];
    images: File[];
    audio: File;
    chat: DirectChat;
    createdAt: Date;
    get public(): DirectChatMessagePublicData;
}
