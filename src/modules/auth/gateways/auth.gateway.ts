import {OnGatewayInit, WebSocketGateway, WebSocketServer, WsException} from "@nestjs/websockets";
import {Server} from "socket.io";
import {UseFilters, UsePipes, ValidationPipe} from "@nestjs/common";
import {NextFunction} from "express";
import * as bcrypt from "bcryptjs";

import {BadRequestTransformationFilter} from "@lib/websockets";
import {ExtendedSocket, SocketHandshakeAuth} from "@lib/typings";
import {UserService} from "@modules/user";

@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway()
export class AuthGateway implements OnGatewayInit {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @WebSocketServer()
  wss: Server;

  afterInit(): void {
    this.wss.use(async (socket: ExtendedSocket, next: NextFunction) => {
      if (!!socket.user) return next(null);

      const payload: SocketHandshakeAuth = socket.handshake.auth as SocketHandshakeAuth;

      const error = new WsException("Invalid credentials.");

      if (!payload) return next(error);

      const user = await this.userService.findOne({
        where: {
          username: payload.username
        }
      });

      if (!user) throw error;

      const doPasswordsMatch = await bcrypt.compare(payload.password, user.password);

      if (!doPasswordsMatch) throw error;

      socket.user = user;

      next(null);
    });
  }
}