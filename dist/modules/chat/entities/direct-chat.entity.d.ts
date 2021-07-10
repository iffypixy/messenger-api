import { ID } from "@lib/typings";
import { DirectChatPublicData } from "../lib/typings";
export declare class DirectChat {
    id: ID;
    get public(): DirectChatPublicData;
}
