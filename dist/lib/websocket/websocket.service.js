"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketService = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
const typings_1 = require("../typings");
let WebsocketService = class WebsocketService {
    getSocketsByUserId(wss, id) {
        const sockets = utils_1.mapToArray(wss.sockets.sockets);
        return sockets.filter((socket) => socket.user.id === id);
    }
};
WebsocketService = __decorate([
    common_1.Injectable()
], WebsocketService);
exports.WebsocketService = WebsocketService;
//# sourceMappingURL=websocket.service.js.map