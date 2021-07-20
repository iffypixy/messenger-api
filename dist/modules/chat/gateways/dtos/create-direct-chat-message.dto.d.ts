import { ID } from "@lib/typings";
export declare class CreateDirectChatMessageDto {
    text?: string;
    audio?: ID;
    files?: ID[];
    images?: ID[];
    parent?: ID;
    partner: ID;
}
