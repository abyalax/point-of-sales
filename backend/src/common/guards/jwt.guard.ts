/** disable-eslint @typescript-eslint/no-unsafe-assignment */

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../../modules/user/dto/user.dto';
import { Request } from 'express';
import { CREDENTIALS } from '../constants/credential';
import { EMessage } from '../types/response';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token: string = request.signedCookies.access_token;
    if (!token) throw new UnauthorizedException(EMessage.TOKEN_NOT_FOUND);

    try {
      const verifyToken = await this.jwtService.verifyAsync(token, {
        secret: CREDENTIALS.JWT_SECRET,
      });
      if (verifyToken) {
        const user = await this.userService.findOneBy({ id: verifyToken.sub });
        const userPlain = plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        });
        request['user'] = {
          email: userPlain.email,
          id: userPlain.id,
          sub: userPlain.id,
          roles: userPlain.roles,
          permissions: userPlain.permissions,
        };
        return true;
      }
      throw new UnauthorizedException();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else {
        return false;
      }
    }
  }
}
