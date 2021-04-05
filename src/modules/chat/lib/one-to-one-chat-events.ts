const prefix = "1O1_CHAT";

export const events = {
  JOINING: `${prefix}:JOINING`
};

export const clientEvents = {
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  MESSAGE_EDITING: `${prefix}:MESSAGE_EDITING`,
  MESSAGE_DELETING: `${prefix}:MESSAGE_DELETING`,
  GETTING_BANNED: `${prefix}:GETTING_BANNED`,
  GETTING_UNBANNED: `${prefix}:GETTING_UNBANNED`
};
