import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";

import {mapToArray} from "@lib/functions";
import {ExtendedSocket} from "@lib/typings";

@Injectable()
export class WebsocketsService {
  getSocketById(wss: Server, id: string): ExtendedSocket | null {
    const sockets: ExtendedSocket[] = mapToArray(wss.sockets.sockets);

    return sockets.find((socket) => socket.id === id) || null;
  }
}
