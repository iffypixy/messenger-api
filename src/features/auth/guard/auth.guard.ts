import {CanActivate, ExecutionContext} from "@nestjs/common";

import {ExtendedRequest} from "@lib/types";

export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<ExtendedRequest>();

    return Boolean(req.user);
  }
}