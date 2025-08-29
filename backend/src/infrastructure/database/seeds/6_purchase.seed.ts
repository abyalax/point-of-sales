import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { PurchaseOrder } from '~/modules/purchase/entities/purchase-order.entity';
import { generateDates } from '../mock/dates.mock';
import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { Product } from '~/modules/product/entity/product.entity';
import { generateMockPurchaseOrder } from '../mock/purchase/purchase-order.mock';

export class PurchaseOrderSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.transaction(async (manager) => {
      console.log('🔄️ Generate purchase order Januari - Juni 2024');

      const suppliers = await manager.find(Supplier);
      const products = await manager.find(Product);

      const dates: Date[] = generateDates({ year: 2024, months: [1, 2, 3, 4, 5, 6], maxPerWeek: 2 });
      const mockPO = generateMockPurchaseOrder(suppliers, products, dates);

      await manager.getRepository(PurchaseOrder).save(mockPO);

      console.log('✅ Seed purchase order Januari - Juni 2024');
    });
  }
}
