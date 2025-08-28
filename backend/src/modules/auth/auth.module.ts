import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseModule } from '~/infrastructure/database/database.module';
import { AuthGuard } from '../../common/guards/auth.guard';
import { userProvider } from '../user/user.provider';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtConfig } from '~/config/jwt.config';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwt = configService.get<JwtConfig>('jwt')!;
        return {
          secret: jwt.secret,
          privateKey: jwt.private_key,
          publicKey: jwt.public_key,
        };
      },
    }),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [...userProvider, AuthService, UserService, AuthGuard],
  exports: [AuthGuard, JwtModule, UserService],
})
export class AuthModule {}
