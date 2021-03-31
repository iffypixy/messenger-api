import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Server} from "socket.io";

import {HandshakeAuth, ExtendedSocket, ID} from "@lib/typings";
import {mapToArray} from "@lib/functions";

@Injectable()
export class ChatGatewayService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async getUserIdBySocket(client: ExtendedSocket): Promise<string> {
    const {token} = client.handshake.auth as HandshakeAuth;

    try {
      const {userId} = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("jwt.secret")
      });

      return userId;
    } catch (error) {
      return null;
    }
  }

  getSocketByUserId(wss: Server, userId: ID): ExtendedSocket | null {
    const sockets: ExtendedSocket[] = mapToArray(wss.sockets.sockets);

    return sockets.find(socket => socket.userId === userId) || null;
  }
}
