import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class IsAuthorizedGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean;
}
