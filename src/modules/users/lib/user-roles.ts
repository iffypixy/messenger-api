export type UserRole = "user" | "administrator";

export const userRoles: UserRole[] = ["user", "administrator"];

export const isAdmin = (role: UserRole): boolean => role === "administrator";
export const isUser = (role: UserRole): boolean => role === "user";
