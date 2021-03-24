export const cleanObject = (obj: any): any =>
  Object.keys(obj).forEach(key => !obj[key] && delete obj[key]);
