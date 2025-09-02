import { Body, Request, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, UnauthorizedException, Res } from '@nestjs/common';
import { Request as RequestExpress, Response as ResponseExpress } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TResponse } from '~/common/types/response';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { User } from '../user/entity/user.entity';
import { JwtGuard } from '~/common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto): Promise<TResponse<User>> {
    const user = await this.authService.signUp(signUpDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: ResponseExpress): Promise<TResponse<User>> {
    const data = await this.authService.signIn(signInDto.email, signInDto.password);
    response.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      signed: true,
    });
    response.cookie('access_token', data.access_token, {
      httpOnly: true,
      signed: true,
    });
    const res: TResponse<User> = {
      statusCode: HttpStatus.ACCEPTED,
      data: data.user,
    };
    return res;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('refresh')
  async refreshToken(@Request() req: RequestExpress, @Res() response: ResponseExpress): Promise<void> {
    const refresh_token: string = req.signedCookies.refresh_token;
    const { access_token } = await this.authService.refreshToken(refresh_token);
    response.cookie('access_token', access_token, {
      httpOnly: true,
      signed: true,
    });
    console.log('refreshing token');
    response.status(200).json({
      statusCode: HttpStatus.ACCEPTED,
    });
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get('logout')
  signOut(@Res({ passthrough: true }) response: ResponseExpress): TResponse {
    response.cookie('refresh_token', '', {
      httpOnly: true,
      signed: true,
    });
    response.cookie('access_token', '', {
      httpOnly: true,
      signed: true,
    });
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Successfully logout',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, JwtGuard)
  @Get('permissions')
  async getFullPermissions(@Request() req: RequestExpress): Promise<TResponse<Permission[] | undefined>> {
    console.log(req.user);
    const id = req.user?.id;
    if (!id) throw new UnauthorizedException();
    const permission = await this.authService.getFullPermissions(id);
    return {
      statusCode: HttpStatus.OK,
      data: permission,
    };
  }
}
