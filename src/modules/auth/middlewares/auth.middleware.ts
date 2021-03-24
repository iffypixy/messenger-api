import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Response} from "express";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

import {ExtendedRequest} from "@lib/typings";
import {UserService} from "@modules/user";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async use(
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token: string = req.cookies["access-token"];

    try {
      const {userId: id} = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("jwt.secret")
      });

      req.user = await this.userService.findOne({id});

      next();
    } catch (e) {
      next();
    }
  }
}
