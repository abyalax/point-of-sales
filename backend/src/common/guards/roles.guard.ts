import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '~/modules/auth/entity/role.entity';
import { User } from '~/modules/user/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) return true;

    const user: User = context.switchToHttp().getRequest().user;
    if (!user?.roles) throw new ForbiddenException('Access denied');

    const hasRole = requiredRoles.some((role) => user.roles?.map((r: Role) => r.name).includes(role));
    if (!hasRole) throw new ForbiddenException('Insufficient role');

    return true;
  }
}
