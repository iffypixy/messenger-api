import { ID } from "@lib/typings";
export interface DirectPublicData {
    id: ID;
}
export declare class Direct {
    id: ID;
    get public(): DirectPublicData;
}
