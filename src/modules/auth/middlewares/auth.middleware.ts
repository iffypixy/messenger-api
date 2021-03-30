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

      const user = await this.userService.findOne({id});

      await this.userService.update({id: user.id}, {lastSeen: new Date()});

      req.user = user;

      next();
    } catch (e) {
      next();
    }
  }
}
