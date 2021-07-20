import { ID } from "@lib/typings";
export interface GroupPublicData {
    id: ID;
    avatar: string;
    title: string;
}
export declare class Group {
    id: ID;
    title: string;
    avatar: string;
    get public(): GroupPublicData;
}
