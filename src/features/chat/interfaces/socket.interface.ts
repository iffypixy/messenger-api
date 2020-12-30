import {Socket} from "socket.io";

export interface IExtendedSocket extends Socket {
    userId: string;
}