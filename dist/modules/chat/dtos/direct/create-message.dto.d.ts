import { ID } from "@lib/typings";
export declare class CreateMessageDto {
    text?: string;
    audio?: ID;
    files?: ID[];
    images?: ID[];
    parent?: ID;
    partner: ID;
}
