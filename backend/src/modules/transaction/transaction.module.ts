import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { transactionProvider } from './transaction.provider';
import { DatabaseModule } from '~/infrastructure/database/database.module';
import { DATABASE } from '~/common/constants/database';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule.forRoot(DATABASE.MYSQL.PROVIDE, DATABASE.MYSQL.OPTIONS), AuthModule],
  controllers: [TransactionController],
  providers: [...transactionProvider, TransactionService],
})
export class TransactionModule {}
