import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { ExtendedRequest } from "@lib/typings";
import { AuthService } from "../services";
export declare class AuthMiddleware implements NestMiddleware {
    private readonly authService;
    constructor(authService: AuthService);
    use(req: ExtendedRequest, res: Response, next: NextFunction): Promise<void>;
}
