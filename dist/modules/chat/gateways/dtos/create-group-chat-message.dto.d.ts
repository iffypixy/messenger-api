import { ID } from "@lib/typings";
export declare class CreateGroupChatMessageDto {
    text?: string;
    audio?: ID;
    files?: ID[];
    images?: ID[];
    parent?: ID;
    group: ID;
}
