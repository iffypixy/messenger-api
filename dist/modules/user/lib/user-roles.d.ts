export declare type UserRole = "user" | "administrator";
export declare const userRoles: UserRole[];
export declare const isAdmin: (role: UserRole) => boolean;
export declare const isUser: (role: UserRole) => boolean;
