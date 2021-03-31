import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayInit
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {NextFunction} from "express";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {UnauthorizedException} from "@nestjs/common";

import {ExtendedSocket, HandshakeAuth} from "@lib/typings";
import {UserService} from "@modules/user";
import {ChatGatewayService} from "../services";

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit {
  constructor(
    private readonly service: ChatGatewayService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @WebSocketServer()
  wss: Server;

  afterInit(): void {
    this.wss.use(async (socket: ExtendedSocket, next: NextFunction) => {
      const {token} = socket.handshake.auth as HandshakeAuth;

      try {
        const {userId} = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>("jwt.secret")
        });

        socket.userId = userId;

        next();
      } catch (error) {
        next(new UnauthorizedException("Invalid token"));
      }
    });
  }
}
