import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { inventoryProvider } from './inventories.provider';
import { DatabaseModule } from '~/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InventoriesController],
  providers: [...inventoryProvider, InventoriesService],
})
export class InventoriesModule {}
