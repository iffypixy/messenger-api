import { ID } from "@lib/typings";
import { GroupChatPublicData } from "../lib/typings";
export declare class GroupChat {
    id: ID;
    title: string;
    avatar: string;
    get public(): GroupChatPublicData;
}
