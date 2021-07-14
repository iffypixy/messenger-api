import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { UploadsService } from "@modules/uploads";
import { User, UsersService, UserPublicData } from "@modules/users";
import { LoginDto, RegisterDto, RefreshTokensDto } from "./dtos";
import { AuthService, RefreshSessionsService } from "./services";
export declare class AuthController {
    private readonly usersService;
    private readonly jwtService;
    private readonly refreshSessionsService;
    private readonly authService;
    private readonly uploadsService;
    constructor(usersService: UsersService, jwtService: JwtService, refreshSessionsService: RefreshSessionsService, authService: AuthService, uploadsService: UploadsService);
    register({ username, password, fingerprint }: RegisterDto, res: Response): Promise<{
        credentials: UserPublicData;
    }>;
    login({ username, password, fingerprint }: LoginDto, res: Response): Promise<{
        credentials: UserPublicData;
    }>;
    refreshTokens({ fingerprint }: RefreshTokensDto, req: Request, res: Response): Promise<void>;
    getCredentials(user: User): {
        credentials: UserPublicData;
    };
    logout(req: Request, res: Response): Promise<void>;
}
