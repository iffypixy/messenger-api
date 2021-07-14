import { User, UserPublicData } from "@modules/user";
import { ID } from "@lib/typings";
import { Direct } from "./direct.entity";
export interface DirectMemberPublicData extends UserPublicData {
    isBanned: boolean;
}
export declare class DirectMember {
    id: ID;
    chat: Direct;
    user: User;
    isBanned: boolean;
    get public(): DirectMemberPublicData;
}
