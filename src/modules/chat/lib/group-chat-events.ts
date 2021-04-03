const prefix = "GROUP_CHAT";

export const events = {
  JOIN: `${prefix}:JOIN`,
  CREATING_CHAT: `${prefix}:CREATING_CHAT`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_EDITING: `${prefix}:MESSAGE_EDITING`,
  SYSTEM_MESSAGE: `${prefix}:SYSTEM_MESSAGE`
};

export const clientEvents = {
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_EDITING: `${prefix}:MESSAGE_EDITING`
};
