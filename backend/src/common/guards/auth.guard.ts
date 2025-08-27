import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EMessage } from '../types/response';
import { CREDENTIALS } from '../constants/credential';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const access_token: string = request.signedCookies.access_token ?? '';

    if (!access_token || access_token === '') throw new UnauthorizedException(EMessage.TOKEN_NOT_FOUND);
    try {
      const verifyToken = await this.jwtService.verifyAsync(access_token, {
        secret: CREDENTIALS.JWT_SECRET,
      });
      if (verifyToken) {
        return true;
      } else {
        throw new UnauthorizedException(EMessage.TOKEN_INVALID);
      }
    } catch (_e) {
      console.log('AuthGuard: ', _e);
      throw new UnauthorizedException(EMessage.TOKEN_EXPIRED);
    }
  }
}
