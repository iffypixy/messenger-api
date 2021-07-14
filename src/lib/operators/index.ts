import {LessThanOrEqual} from "typeorm";
import * as format from "dateformat";

const scheme = "yyyy-mm-dd HH:MM:ss.l";

export const LessThanOrEqualDate = (date: Date) => LessThanOrEqual(`${format(date, scheme)}000`);