"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThanOrEqualDate = void 0;
const typeorm_1 = require("typeorm");
const format = require("dateformat");
const scheme = "yyyy-mm-dd HH:MM:ss.l";
exports.LessThanOrEqualDate = (date) => typeorm_1.LessThanOrEqual(`${format(date, scheme)}000`);
//# sourceMappingURL=index.js.map