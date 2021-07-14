import { JwtService } from "@nestjs/jwt";
import { CookieOptions } from "express";
import { ConfigService } from "@nestjs/config";
import { User, UsersService } from "@modules/users";
import { RefreshSessionsService } from "./refresh-sessions.service";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly refreshSessionService;
    private readonly configService;
    constructor(userService: UsersService, jwtService: JwtService, refreshSessionService: RefreshSessionsService, configService: ConfigService);
    findUserByAccessToken(token: string): Promise<User | null>;
    getJWTs(user: User, fingerprint: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    get accessTokenCookieOptions(): CookieOptions;
    get refreshTokenCookieOptions(): CookieOptions;
}
