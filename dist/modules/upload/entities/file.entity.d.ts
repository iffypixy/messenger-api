import { User } from "@modules/user";
import { ID } from "@lib/typings";
import { FilePublicData } from "../lib/typings";
export declare class File {
    id: ID;
    name: string;
    size: number;
    extension: string;
    url: string;
    user: User;
    get public(): FilePublicData;
}
