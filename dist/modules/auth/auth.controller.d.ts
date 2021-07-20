import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { UploadService } from "@modules/upload";
import { User, UserService, UserPublicData } from "@modules/user";
import { LoginDto, RegisterDto, RefreshTokensDto } from "./dtos";
import { AuthService, RefreshSessionService } from "./services";
export declare class AuthController {
    private readonly userService;
    private readonly jwtService;
    private readonly refreshSessionService;
    private readonly authService;
    private readonly uploadService;
    constructor(userService: UserService, jwtService: JwtService, refreshSessionService: RefreshSessionService, authService: AuthService, uploadService: UploadService);
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
