import {LessThanOrEqual} from "typeorm";
import {format} from "date-fns";

const scheme = "yyyy-MM-dd kk:mm:ss.SSS";

export const DateLessThanOrEqual = (date: Date) => LessThanOrEqual(format(date, scheme));