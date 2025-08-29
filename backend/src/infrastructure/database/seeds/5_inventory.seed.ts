import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Inventory } from '~/modules/inventories/entities/inventory.entity';

type OmitInventory = Omit<Inventory, 'id' | 'supplier' | 'product' | 'logs'>;

export class InventorySeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    const inventoryRepo = dataSource.getRepository(Inventory);

    const mockInventory: OmitInventory[] = Array.from({ length: 30 }).map((_, i) => ({
      product_id: i + 1,
      stock: Math.floor(Math.random() * (100 - 10 + 1) + 10),
      min_stock: Math.floor(Math.random() * (50 - 10 + 1) + 10),
      max_stock: Math.floor(Math.random() * (200 - 50 + 1) + 50),
    }));

    await inventoryRepo.insert(mockInventory);
  }
}
