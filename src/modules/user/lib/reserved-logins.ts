const reservedLogins = [
  "administrator",
  "user",
  "admin",
  "me",
  "moder",
  "moderator"
];

export const isReserved = (login: string): boolean => reservedLogins.includes(login);
