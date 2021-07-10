import { User } from "@modules/user";
import { ID } from "@lib/typings";
import { DirectChatMemberPublicData } from "../lib/typings";
import { DirectChat } from "./direct-chat.entity";
export declare class DirectChatMember {
    id: ID;
    chat: DirectChat;
    user: User;
    isBanned: boolean;
    get public(): DirectChatMemberPublicData;
}
export declare const publicise: (member: DirectChatMember) => DirectChatMemberPublicData;
