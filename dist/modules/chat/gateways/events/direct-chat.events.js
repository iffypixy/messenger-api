"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientEvents = exports.serverEvents = void 0;
const prefix = "DIRECT_CHAT";
exports.serverEvents = {
    GET_MESSAGES: `${prefix}:GET_MESSAGES`,
    GET_CHATS: `${prefix}:GET_CHATS`,
    GET_CHAT: `${prefix}:GET_CHAT`,
    GET_IMAGES: `${prefix}:GET_IMAGES`,
    GET_AUDIOS: `${prefix}:GET_AUDIOS`,
    GET_FILES: `${prefix}:GET_FILES`,
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
//# sourceMappingURL=direct-chat.events.js.map