import { Server } from "socket.io";
import { ExtendedSocket, ID } from "@lib/typings";
export declare class WebsocketService {
    getSocketsByUserId(wss: Server, id: ID): ExtendedSocket[];
}
