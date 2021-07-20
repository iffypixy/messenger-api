import { User } from "@modules/user";
import { ID } from "@lib/typings";
export declare class RefreshSession {
    id: ID;
    user: User;
    fingerprint: string;
    token: string;
    expiresAt: Date;
}
