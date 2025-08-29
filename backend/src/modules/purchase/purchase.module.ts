import { Module } from '@nestjs/common';

import { DatabaseModule } from '~/infrastructure/database/database.module';
import { PurchaseController } from './purchase.controller';
import { purchaseProvider } from './purchase.provider';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PurchaseController],
  providers: [...purchaseProvider, PurchaseService],
})
export class PurchaseModule {}
