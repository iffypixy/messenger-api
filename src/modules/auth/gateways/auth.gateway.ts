import {OnGatewayInit, WebSocketGateway, WebSocketServer, WsException} from "@nestjs/websockets";
import {Server} from "socket.io";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {NextFunction} from "express";
import * as cookie from "cookie";

import {BadRequestTransformationFilter} from "@lib/websockets";
import {ExtendedSocket} from "@lib/typings";
import {RefreshSessionService} from "../services";

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class AuthGateway implements OnGatewayInit {
  constructor(
    private readonly refreshSessionService: RefreshSessionService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  afterInit(): void {
    this.wss.use(async (socket: ExtendedSocket, next: NextFunction) => {
      if (!!socket.user) return next(null);

      const cookies = cookie.parse(socket.request.headers.cookie);

      const token = cookies["refresh-token"];

      const error = new WsException("Invalid credentials.");

      if (!token) return next(error);

      const session = await this.refreshSessionService.findOne({
        where: {token}
      });

      if (!session) throw error;

      socket.user = session.user;

      next(null);
    });
  }
}