const prefix = "DIRECT_CHAT";

export const serverEvents = {
  CREATE_MESSAGE: `${prefix}:CREATE_MESSAGE`,
  READ_MESSAGE: `${prefix}:READ_MESSAGE`,
  BAN_PARTNER: `${prefix}:BAN_PARTNER`,
  UNBAN_PARTNER: `${prefix}:UNBAN_PARTNER`
};

export const clientEvents = {
  MESSAGE: `${prefix}:MESSAGE`,
  BANNED: `${prefix}:BANNED`,
  UNBANNED: `${prefix}:UNBANNED`,
  MESSAGE_READ: `${prefix}:MESSAGE_READ`
};