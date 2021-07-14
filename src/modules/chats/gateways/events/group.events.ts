const prefix = "GROUP_CHAT";

export const serverEvents = {
  SUBSCRIBE: `${prefix}:SUBSCRIBE`,
  GET_MESSAGES: `${prefix}:GET_MESSAGES`,
  GET_CHATS: `${prefix}:GET_CHATS`,
  GET_CHAT: `${prefix}:GET_CHAT`,
  GET_IMAGES: `${prefix}:GET_IMAGES`,
  GET_AUDIOS: `${prefix}:GET_AUDIOS`,
  GET_FILES: `${prefix}:GET_FILES`,
  CREATE_MESSAGE: `${prefix}:CREATE_MESSAGE`,
  READ_MESSAGE: `${prefix}:READ_MESSAGE`,
  ADD_MEMBER: `${prefix}:ADD_MEMBER`,
  KICK_MEMBER: `${prefix}:KICK_MEMBER`,
  LEAVE: `${prefix}:LEAVE`,
  CREATE_CHAT: `${prefix}:CREATE_CHAT`
};

export const clientEvents = {
  MESSAGE: `${prefix}:MESSAGE`,
  SYSTEM_MESSAGE: `${prefix}:SYSTEM_MESSAGE`,
  CHAT_CREATED: `${prefix}:CHAT_CREATED`,
  MEMBER_ADDED: `${prefix}:MEMBER_ADDED`,
  MEMBER_KICKED: `${prefix}:MEMBER_KICKED`,
  ADDED: `${prefix}:ADDED`,
  KICKED: `${prefix}:KICKED`,
  MEMBER_LEFT: `${prefix}:MEMBER_LEFT`,
  OWNER_REPLACEMENT: `${prefix}:OWNER_REPLACEMENT`,
  MESSAGE_READ: `${prefix}:MESSAGE_READ`
};