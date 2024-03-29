import {LessThan} from "typeorm";
import * as format from "dateformat";

const scheme = "yyyy-mm-dd HH:MM:ss.l";

export const LessThanDate = (date: Date) => LessThan(`${format(date, scheme)}000`);