import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '~/config/jwt.config';
import { Permission } from './entity/permission.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const userExist = await this.userService.findByEmail(signUpDto.email);
    if (userExist) throw new BadRequestException();

    const created = await this.userService.create(signUpDto);
    const user = await this.userService.findOne({ where: { id: created.id }, relations: ['roles'] });
    return user;
  }

  async signIn(email: string, password: string): Promise<{ access_token: string; refresh_token: string; user: User }> {
    const isUserExist = await this.userService.findByEmail(email);
    if (isUserExist === null) throw new NotFoundException('Email Not Found');

    const comparePassword = await bcrypt.compare(password, isUserExist.password!);
    if (!comparePassword) throw new UnauthorizedException('Invalid Password');

    const permissions = await this.userService.getFlattenPermissions(isUserExist.id);

    const user = {
      id: isUserExist.id,
      name: isUserExist.name,
      email: isUserExist.email,
      permissions: permissions,
      roles: isUserExist.roles,
    };
    const payload = { email: isUserExist.email, sub: isUserExist.id };
    const jwt = this.configService.get<JwtConfig>('jwt')!;
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24, // 24 hour
      secret: jwt.secret,
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24 * 30, // 24 hour * 30 days
      secret: jwt.refresh_secret,
    });
    return {
      access_token,
      refresh_token,
      user: user,
    };
  }

  async refreshToken(refresh_token?: string): Promise<{ access_token: string }> {
    if (refresh_token === undefined) throw new UnauthorizedException();
    const jwt = this.configService.get<JwtConfig>('jwt')!;
    const verifyToken = this.jwtService.verify(refresh_token, {
      secret: jwt.refresh_secret,
    });
    if (!verifyToken) throw new UnauthorizedException();
    const payload = { email: verifyToken.email, sub: verifyToken.sub };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24, // 24 hour,
        secret: jwt.secret,
      }),
    };
  }

  async getFullPermissions(id: number): Promise<Permission[] | undefined> {
    return await this.userService.getFullPermissions(id);
  }
}
