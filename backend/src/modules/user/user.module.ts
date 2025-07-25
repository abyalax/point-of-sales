import { Module } from '@nestjs/common';
import { userProvider } from './user.provider';
import { UserService } from './user.service';
import { DatabaseModule } from '~/infrastructure/database/database.module';
import { DATABASE } from '~/common/constants/database';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule.forRoot(DATABASE.MYSQL.PROVIDE, DATABASE.MYSQL.OPTIONS)],
  providers: [...userProvider, UserService],
  controllers: [UserController],
  exports: [UserService, ...userProvider],
})
export class UserModule {}
