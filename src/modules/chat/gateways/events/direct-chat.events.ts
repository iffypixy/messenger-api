const prefix = "DIRECT_CHAT";

export const serverEvents = {
  GET_MESSAGES: `${prefix}:GET_MESSAGES`,
  GET_CHATS: `${prefix}:GET_CHATS`,
  GET_CHAT: `${prefix}:GET_CHAT`,
  GET_IMAGES: `${prefix}:GET_IMAGES`,
  GET_AUDIOS: `${prefix}:GET_AUDIOS`,
  GET_FILES: `${prefix}:GET_FILES`,
  CREATE_MESSAGE: `${prefix}:CREATE_MESSAGE`,
  BAN_PARTNER: `${prefix}:BAN_PARTNER`,
  UNBAN_PARTNER: `${prefix}:UNBAN_PARTNER`
};

export const clientEvents = {
  MESSAGE: `${prefix}:MESSAGE`,
  BANNED: `${prefix}:BANNED`,
  UNBANNED: `${prefix}:UNBANNED`
};