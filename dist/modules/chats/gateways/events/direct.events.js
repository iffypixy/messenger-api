"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientEvents = exports.serverEvents = void 0;
const prefix = "DIRECT_CHAT";
exports.serverEvents = {
    CREATE_MESSAGE: `${prefix}:CREATE_MESSAGE`,
    READ_MESSAGE: `${prefix}:READ_MESSAGE`,
    BAN_PARTNER: `${prefix}:BAN_PARTNER`,
    UNBAN_PARTNER: `${prefix}:UNBAN_PARTNER`
};
exports.clientEvents = {
    MESSAGE: `${prefix}:MESSAGE`,
    BANNED: `${prefix}:BANNED`,
    UNBANNED: `${prefix}:UNBANNED`,
    MESSAGE_READ: `${prefix}:MESSAGE_READ`
};
//# sourceMappingURL=direct.events.js.map