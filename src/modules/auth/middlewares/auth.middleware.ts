import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";

import {ExtendedRequest} from "@lib/typings";
import {AuthService} from "../services";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token: string = req.cookies["access-token"];

    if (token) req.user = await this.authService.findUserByAccessToken(token);

    next();
  }
}
