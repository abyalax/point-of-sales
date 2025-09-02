import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { Product } from '~/modules/product/entity/product.entity';

type OmitInventory = Omit<Inventory, 'id' | 'supplier' | 'product' | 'logs'>;

export class InventorySeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    const inventoryRepo = dataSource.getRepository(Inventory);
    const productRepo = dataSource.getRepository(Product);

    const products = await productRepo.find({ select: { id: true, barcode: true } });

    const mockInventory: OmitInventory[] = products.map((product) => ({
      product_id: product.id,
      barcode: product.barcode,
      stock: Math.floor(Math.random() * (100 - 10 + 1) + 10),
      min_stock: Math.floor(Math.random() * (50 - 10 + 1) + 10),
      max_stock: Math.floor(Math.random() * (200 - 50 + 1) + 50),
    }));

    console.log('✅ Seed inventories successfully');
    await inventoryRepo.insert(mockInventory);

    console.log('🔄️ Updating supplier_id table inventories');
    await inventoryRepo.query(`
      UPDATE inventories
      SET
          supplier_id = 1
      WHERE
          product_id
      IN (1, 2, 4, 6, 8, 10, 12, 16, 18, 20, 22, 26, 28);
    `);
    await inventoryRepo.query(`
      UPDATE inventories
      SET
          supplier_id = 2
      WHERE
          product_id
      IN (3, 7, 11, 15, 17, 19, 21, 23, 27, 29);
    `);
    await inventoryRepo.query(`
      UPDATE inventories
      SET
          supplier_id = 3
      WHERE
          product_id
      IN (5, 9, 13, 25);
    `);
    await inventoryRepo.query(`
      UPDATE inventories
      SET
          supplier_id = 4
      WHERE
          product_id
      IN (14, 24, 30);
    `);
    console.log('✅ Seed supplier_id at table inventories successfully');
  }
}
