import { ID } from "@lib/typings";
export declare class CreateMessageDto {
    text?: string;
    audioId?: ID;
    filesIds?: ID[];
    imagesIds?: ID[];
    parentId?: ID;
    partnerId: ID;
}
