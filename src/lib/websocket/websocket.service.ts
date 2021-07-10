import {Injectable} from "@nestjs/common";
import {Server} from "socket.io";

import {mapToArray} from "@lib/utils";
import {ExtendedSocket, ID} from "@lib/typings";

@Injectable()
export class WebsocketService {
  getSocketsByUserId(wss: Server, id: ID): ExtendedSocket[] {
    const sockets: ExtendedSocket[] = mapToArray(wss.sockets.sockets);

    return sockets.filter((socket) => socket.user.id === id);
  }
}
