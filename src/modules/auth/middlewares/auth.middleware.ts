import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";

import {UsersService} from "@modules/users";
import {ExtendedRequest} from "@lib/typings";
import {AuthService} from "../services";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {
  }

  async use(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token: string = req.cookies["access-token"];

    const user = await this.authService.findUserByAccessToken(token);

    if (user) req.user = await this.usersService.save({
      ...user, lastSeen: new Date()
    });

    next();
  }
}
