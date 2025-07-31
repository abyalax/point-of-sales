import { Module } from '@nestjs/common';
import {} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [ProductModule, AuthModule, UserModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
