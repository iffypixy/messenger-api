import {OnGatewayInit, WebSocketGateway, WebSocketServer, WsException} from "@nestjs/websockets";
import {Server} from "socket.io";
import {BadRequestException, UnauthorizedException} from "@nestjs/common";
import {NextFunction} from "express";
import * as bcrypt from "bcryptjs";

import {ExtendedSocket, SocketHandshakeAuth} from "@lib/typings";
import {UserService} from "@modules/user";

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

      if (!payload) return next(new UnauthorizedException("Invalid credentials."));

      const user = await this.userService.findOne({
        where: {
          username: payload.username
        }
      });

      const error = new WsException("Invalid credentials.");

      if (!user) throw error;

      const doPasswordsMatch = await bcrypt.compare(payload.password, user.password);

      if (!doPasswordsMatch) throw error;

      socket.user = user;

      next(null);
    });
  }
}