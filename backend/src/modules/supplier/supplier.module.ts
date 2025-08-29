import { Module } from '@nestjs/common';

import { DatabaseModule } from '~/infrastructure/database/database.module';
import { SupplierController } from './supplier.controller';
import { supplierProvider } from './supplier.provider';
import { SupplierService } from './supplier.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierController],
  providers: [...supplierProvider, SupplierService],
})
export class SupplierModule {}
