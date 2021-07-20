"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToArray = exports.clearObject = void 0;
exports.clearObject = (obj) => Object.keys(obj).forEach(key => !obj[key] && delete obj[key]);
exports.mapToArray = (map) => Array.from(map, ([_, value]) => value);
//# sourceMappingURL=index.js.map