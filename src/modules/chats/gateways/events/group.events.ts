const prefix = "GROUP_CHAT";

export const serverEvents = {
  SUBSCRIBE: `${prefix}:SUBSCRIBE`,
  CREATE_MESSAGE: `${prefix}:CREATE_MESSAGE`,
  READ_MESSAGE: `${prefix}:READ_MESSAGE`,
  ADD_MEMBER: `${prefix}:ADD_MEMBER`,
  KICK_MEMBER: `${prefix}:KICK_MEMBER`,
  LEAVE: `${prefix}:LEAVE`,
  CREATE_CHAT: `${prefix}:CREATE_CHAT`
};

export const clientEvents = {
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