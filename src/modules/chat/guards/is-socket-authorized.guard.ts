import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

import {HandshakeAuth, ExtendedSocket} from "@lib/typings";

@Injectable()
export class IsSocketAuthorizedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const client = ctx.switchToWs().getClient<ExtendedSocket>();

    const {token} = client.handshake.auth as HandshakeAuth;

    try {
      const {userId} = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("jwt.secret")
      });

      return !!userId;
    } catch (error) {
      return false;
    }
  }
}
