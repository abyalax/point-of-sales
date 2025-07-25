import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleDto } from '~/modules/auth/dto/role/get-role.dto';
import { UserDto } from '~/modules/user/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) return true;

    const user: UserDto = context.switchToHttp().getRequest().user;
    if (!user?.roles) throw new ForbiddenException('Access denied');

    const hasRole = requiredRoles.some((role) => user.roles.map((r: RoleDto) => r.name).includes(role));
    if (!hasRole) throw new ForbiddenException('Insufficient role');

    return true;
  }
}
