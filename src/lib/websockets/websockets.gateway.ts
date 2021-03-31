import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {NextFunction} from "express";
import {UnauthorizedException} from "@nestjs/common";

import {ExtendedSocket, ID} from "@lib/typings";
import {WebsocketsService} from "./websockets.service";

@WebSocketGateway()
export class WebsocketsGateway {
  constructor(private readonly websocketsService: WebsocketsService) {}

  @WebSocketServer()
  wss: Server;

  async afterInit(): Promise<void> {
    this.websocketsService.wss = this.wss;

    this.wss.use(async (socket: ExtendedSocket, next: NextFunction) => {
      const id: ID | null = await this.websocketsService.getUserIdBySocket(
        socket
      );

      if (!id) throw new UnauthorizedException("Invalid token.");

      socket.userId = id;

      next();
    });
  }
}
