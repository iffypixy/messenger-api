import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {CookieOptions} from "express";
import {v4} from "uuid";
import {ConfigService} from "@nestjs/config";

import {User, UsersService} from "@modules/users";
import {RefreshSessionsService} from "./refresh-sessions.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshSessionService: RefreshSessionsService,
    private readonly configService: ConfigService
  ) {}

  async findUserByAccessToken(token: string): Promise<User | null> {
    try {
      const {userId} = await this.jwtService.verifyAsync(token);

      return this.usersService.findById(userId);
    } catch (error) {
      return null;
    }
  }

  async getJWTs(user: User, fingerprint: string): Promise<{accessToken: string; refreshToken: string}> {
    const refreshTokenExpiresIn = this.configService.get<number>("jwt.refreshToken.expiresIn");

    const accessToken = await this.jwtService.signAsync({
      userId: user.id
    });

    const refreshToken = await this.refreshSessionService.create({
      user, fingerprint, token: v4(),
      expiresAt: new Date(Date.now() + refreshTokenExpiresIn),
    });

    return {
      accessToken,
      refreshToken: refreshToken.token
    };
  }

  get accessTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      path: "/",
      maxAge: this.configService.get<number>("jwt.accessToken.expiresIn")
    };
  }

  get refreshTokenCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      path: "/",
      maxAge: this.configService.get<number>("jwt.refreshToken.expiresIn")
    };
  }
}
