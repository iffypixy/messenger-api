const prefix = "1O1_CHAT";

export const events = {
  JOIN: `${prefix}:JOIN`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  BANNING_PARTNER: `${prefix}:BANNING_PARTNER`,
  UNBANNING_PARTNER: `${prefix}:UNBANNING_PARTNER`,
  MESSAGE_EDITING: `${prefix}:MESSAGE_EDITING`
};

export const clientEvents = {
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  GETTING_BANNED: `${prefix}:GETTING_BANNED`,
  GETTING_UNBANNED: `${prefix}:`,
  MESSAGE_EDITING: `${prefix}:MESSAGE_EDITING`
};
