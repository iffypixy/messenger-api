import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {CookieOptions} from "express";
import {v4} from "uuid";
import {ConfigService} from "@nestjs/config";

import {User, UserService} from "@modules/user";
import {RefreshSessionService} from "./refresh-session.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshSessionService: RefreshSessionService,
    private readonly configService: ConfigService
  ) {}

  async findUserByToken(token: string): Promise<User | null> {
    try {
      const {userId} = await this.jwtService.verifyAsync(token);

      const user = await this.userService.findById(userId);

      if (!user) return null;

      const lastSeen = new Date();

      return this.userService.save({
        ...user, lastSeen
      });
    } catch (error) {
      return null;
    }
  }

  async getJWTs(user: User, fingerprint: string): Promise<{accessToken: string; refreshToken: string}> {
    const refreshTokenExpiresIn = this.configService.get<number>(
      "jwt.refreshToken.expiresIn"
    );

    const accessToken = await this.jwtService.signAsync({
      userId: user.id
    });

    const refreshToken = await this.refreshSessionService.create({
      user: user, fingerprint,
      expiresAt: new Date(Date.now() + refreshTokenExpiresIn),
      token: v4()
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
      path: "/v1/api/auth",
      maxAge: this.configService.get<number>("jwt.refreshToken.expiresIn")
    };
  }
}
