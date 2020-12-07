import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

import {User} from "@features/user";
import {RefreshSessionService} from "./refresh-session.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshSessionService: RefreshSessionService
  ) {
  }

  async getJWTs(user: User, fingerprint: string):
    Promise<{accessToken: string; refreshToken: string}> {

    const accessToken = this.jwtService.sign({userId: String(user.id)});

    const refreshSession = await this.refreshSessionService.create({
      fingerprint, user,
      expiresIn: this.refreshSessionService.getExpirationDate()
    });

    return {
      accessToken, refreshToken: refreshSession.token
    };
  }
}