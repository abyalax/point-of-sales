import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from '~/infrastructure/database/database.module';
import { DATABASE } from '~/common/constants/database';
import { UserService } from '../user/user.service';
import { userProvider } from '../user/user.provider';
import { JwtModule } from '@nestjs/jwt';
import { CREDENTIALS } from '~/common/constants/credential';
import { AuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: CREDENTIALS.JWT_SECRET,
      privateKey: CREDENTIALS.JWT_PRIVATE_KEY,
      publicKey: CREDENTIALS.JWT_PUBLIC_KEY,
    }),
    DatabaseModule.forRoot(DATABASE.MYSQL.PROVIDE, DATABASE.MYSQL.OPTIONS),
  ],
  controllers: [AuthController],
  providers: [...userProvider, AuthService, UserService, AuthGuard],
  exports: [AuthGuard, JwtModule, UserService],
})
export class AuthModule {}
