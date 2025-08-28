import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserDto } from '../../modules/user/dto/user.dto';
import { UserService } from '~/modules/user/user.service';
import { plainToInstance } from 'class-transformer';
import { EMessage } from '../types/response';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '~/config/jwt.config';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const jwt = this.configService.get<JwtConfig>('jwt')!;
    const token: string = request.signedCookies.access_token;
    if (!token) throw new UnauthorizedException(EMessage.TOKEN_NOT_FOUND);

    try {
      const verifyToken = await this.jwtService.verifyAsync(token, {
        secret: jwt.secret,
      });
      if (verifyToken) {
        const user = await this.userService.findOneBy({ id: verifyToken.sub });
        const userDto = plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        });
        request['user'] = {
          email: userDto.email,
          id: userDto.id,
          sub: userDto.id,
          roles: userDto.roles,
          permissions: userDto.permissions,
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
