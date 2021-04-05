const prefix = "GROUP_CHAT";

export const events = {
  JOINING: `${prefix}:JOINING`
};

export const clientEvents = {
  JOINING: `${prefix}:JOINING`,
  MESSAGE_READING: `${prefix}:MESSAGE_READING`,
  MESSAGE_SENDING: `${prefix}:MESSAGE_SENDING`,
  MESSAGE_EDITING: `${prefix}:MESSAGE_EDITING`,
  MESSAGE_DELETING: `${prefix}:MESSAGE_DELETING`,
  KICK: `${prefix}:KICK`
};
