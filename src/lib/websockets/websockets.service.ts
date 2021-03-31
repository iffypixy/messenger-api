import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Server} from "socket.io";

import {HandshakeAuth, ExtendedSocket, ID} from "@lib/typings";
import {mapToArray} from "@lib/functions";

@Injectable()
export class WebsocketsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  wss: Server;

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

  getSocketsByUserId(id: ID): ExtendedSocket[] {
    const sockets: ExtendedSocket[] = mapToArray(this.wss.sockets.sockets);

    return sockets.filter(socket => socket.userId === id);
  }
}
