import {OnGatewayInit, WebSocketGateway, WebSocketServer, WsException} from "@nestjs/websockets";
import {Server} from "socket.io";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {NextFunction} from "express";
import * as cookie from "cookie";

import {BadRequestTransformationFilter} from "@lib/websocket";
import {ExtendedSocket} from "@lib/typings";
import {AuthService} from "../services";

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class AuthGateway implements OnGatewayInit {
  constructor(
    private readonly authService: AuthService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  afterInit(): void {
    this.wss.use(async (socket: ExtendedSocket, next: NextFunction) => {
      if (!!socket.user) return next(null);

      const cookies = cookie.parse(socket.request.headers.cookie);

      const token: string = cookies["access-token"];

      const error = new WsException("Invalid credentials");

      if (!token) return next(error);

      const user = await this.authService.findUserByAccessToken(token);

      if (!user) throw error;

      socket.user = user;

      next(null);
    });
  }
}