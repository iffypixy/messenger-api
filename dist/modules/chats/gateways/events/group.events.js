"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientEvents = exports.serverEvents = void 0;
const prefix = "GROUP_CHAT";
exports.serverEvents = {
    SUBSCRIBE: `${prefix}:SUBSCRIBE`,
    CREATE_MESSAGE: `${prefix}:CREATE_MESSAGE`,
    READ_MESSAGE: `${prefix}:READ_MESSAGE`,
    ADD_MEMBER: `${prefix}:ADD_MEMBER`,
    KICK_MEMBER: `${prefix}:KICK_MEMBER`,
    LEAVE: `${prefix}:LEAVE`,
    CREATE_CHAT: `${prefix}:CREATE_CHAT`
};
exports.clientEvents = {
    MESSAGE: `${prefix}:MESSAGE`,
    CHAT_CREATED: `${prefix}:CHAT_CREATED`,
    MEMBER_ADDED: `${prefix}:MEMBER_ADDED`,
    MEMBER_KICKED: `${prefix}:MEMBER_KICKED`,
    ADDED: `${prefix}:ADDED`,
    KICKED: `${prefix}:KICKED`,
    MEMBER_LEFT: `${prefix}:MEMBER_LEFT`,
    OWNER_REPLACEMENT: `${prefix}:OWNER_REPLACEMENT`,
    MESSAGE_READ: `${prefix}:MESSAGE_READ`
};
//# sourceMappingURL=group.events.js.map