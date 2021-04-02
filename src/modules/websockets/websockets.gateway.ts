import {
  ConnectedSocket,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {NextFunction} from "express";
import {UnauthorizedException} from "@nestjs/common";

import {authEvents} from "@modules/auth";
import {ExtendedSocket, HandshakeAuth} from "@lib/typings";
import {WebsocketsService} from "./websockets.service";
import {AuthService} from "@modules/auth/services";

@WebSocketGateway()
export class WebsocketsGateway implements OnGatewayDisconnect {
  constructor(
    private readonly websocketsService: WebsocketsService,
    private readonly authService: AuthService
  ) {}

  @WebSocketServer()
  wss: Server;

  async afterInit(): Promise<void> {
    this.websocketsService.wss = this.wss;

    this.wss.use(async (socket: ExtendedSocket, next: NextFunction) => {
      const {token} = socket.handshake.auth as HandshakeAuth;

      const user = await this.authService.findUserByToken(token);

      if (!user) throw new UnauthorizedException("Invalid token.");

      socket.user = user;

      next();
    });
  }

  handleDisconnect(@ConnectedSocket() client: ExtendedSocket): void {
    clearTimeout(client.idleTimeout);

    client.emit(authEvents.USER_OFFLINE, {id: client.user.id});
  }
}
