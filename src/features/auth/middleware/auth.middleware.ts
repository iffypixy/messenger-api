import {Injectable, NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {NextFunction, Response} from "express";
import {JwtService} from "@nestjs/jwt";

import {IExtendedRequest} from "@lib/types";
import {UserService} from "@features/user";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
  }

  async use(req: IExtendedRequest, res: Response, next: NextFunction): Promise<void> {
    const exception = new UnauthorizedException("Invalid token");

    const token: string = req.cookies["access-token"];

    if (!token) throw exception;

    try {
      const {userId} = this.jwtService.verify(token);

      const user = await this.userService.findById(userId);

      if (!user) throw exception;

      req.user = user;

      next();
    } catch (error) {
      throw exception;
    }
  }
}