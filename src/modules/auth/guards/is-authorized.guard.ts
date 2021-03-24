import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";

import {ExtendedRequest} from "@lib/typings";

@Injectable()
export class IsAuthorizedGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req: ExtendedRequest = ctx.switchToHttp().getRequest();

    return !!req.user;
  }
}