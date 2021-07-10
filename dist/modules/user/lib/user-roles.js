"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUser = exports.isAdmin = exports.userRoles = void 0;
exports.userRoles = ["user", "administrator"];
exports.isAdmin = (role) => role === "administrator";
exports.isUser = (role) => role === "user";
//# sourceMappingURL=user-roles.js.map