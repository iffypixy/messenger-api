import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";

import {ExtendedSocket, ID} from "@lib/typings";
import {mapToArray} from "@lib/functions";

@Injectable()
export class WebsocketsService {
  wss: Server;

  getSocketsByUserId(id: ID): ExtendedSocket[] {
    const sockets: ExtendedSocket[] = mapToArray(this.wss.sockets.sockets);

    return sockets.filter(socket => socket.user.id === id && socket.connected);
  }
}
