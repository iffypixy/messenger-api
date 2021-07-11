import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";

import {UserService} from "@modules/user";
import {ExtendedRequest} from "@lib/typings";
import {AuthService} from "../services";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {
  }

  async use(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token: string = req.cookies["access-token"];

    const user = await this.authService.findUserByAccessToken(token);

    if (user) req.user = await this.userService.save({
      ...user, lastSeen: new Date()
    });

    next();
  }
}
