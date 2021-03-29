import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

import {HandshakeAuth, ExtendedSocket} from "@lib/typings";

@Injectable()
export class GatewayService {
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
}
