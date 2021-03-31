export const cleanObject = (obj: any): any =>
  Object.keys(obj).forEach(key => !obj[key] && delete obj[key]);

export const mapToArray = (map: Map<any, any>): Array<any> =>
  Array.from(map, ([_, value]) => value);
