import { User } from "@modules/user";
import { ID } from "@lib/typings";
export interface FilePublicData {
    id: ID;
    name: string;
    size: number;
    url: string;
}
export declare class File {
    id: ID;
    name: string;
    size: number;
    extension: string;
    url: string;
    user: User;
    get public(): FilePublicData;
}
