import { JwtService } from "@nestjs/jwt";
import { CookieOptions } from "express";
import { ConfigService } from "@nestjs/config";
import { User, UserService } from "@modules/user";
import { RefreshSessionService } from "./refresh-session.service";
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly refreshSessionService;
    private readonly configService;
    constructor(userService: UserService, jwtService: JwtService, refreshSessionService: RefreshSessionService, configService: ConfigService);
    findUserByAccessToken(token: string): Promise<User | null>;
    getJWTs(user: User, fingerprint: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    get accessTokenCookieOptions(): CookieOptions;
    get refreshTokenCookieOptions(): CookieOptions;
}
