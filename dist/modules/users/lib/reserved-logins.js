"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReserved = void 0;
const reservedLogins = [
    "administrator",
    "user",
    "admin",
    "me",
    "moder",
    "moderator"
];
exports.isReserved = (login) => reservedLogins.includes(login);
//# sourceMappingURL=reserved-logins.js.map