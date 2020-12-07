import {CanActivate, ExecutionContext} from "@nestjs/common";

import {IExtendedRequest} from "@lib/types";

export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<IExtendedRequest>();

    return Boolean(req.user);
  }
}