import { OmitProduct, OmitTransactionState } from '~/modules/transaction/transaction.schema';
import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';
import { generateTransactionDates } from '../mock/transactions/transaction-dates.mock';
import { generateMockTransaction } from '../mock/transactions/transaction.mock';
import { generateMockCart } from '../mock/transactions/carts.mock';
import { Product } from '~/modules/product/entity/product.entity';
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class TransactionSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.manager.transaction(async (manager) => {
      let products: OmitProduct[] = [];
      let transactions: OmitTransactionState[] = [];
      let dates: Date[] = [];
      console.log('1️⃣ Ambil semua produk awal');
      products = await manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .select([
          'product.name AS name',
          'product.barcode AS barcode',
          'product.price AS price',
          'product.cost_price AS cost_price',
          'product.tax_rate AS tax_rate',
          'product.discount AS discount',
          'product.status AS status',
          'category.name AS category',
        ])
        .getRawMany();

      console.log('2️⃣ Generate transaksi Januari - Juni');
      dates = generateTransactionDates({ year: 2024, months: [1, 2, 3, 4, 5, 6], maxPerWeek: 9 });
      transactions = dates.map((d) => generateMockTransaction(generateMockCart(products, 1, 7), d));

      let transactionEntities = transactions.map((t) =>
        manager.getRepository(Transaction).create({
          ...t,
          user: { id: t.user_id },
          items: t.items.map((item) => manager.getRepository(TransactionItem).create(item)),
        }),
      );
      await manager.save(transactionEntities);
      console.log('✅ Seed transactions Januari - Juni 2024');

      console.log('3️⃣ Flip diskon produk pertama');
      await manager
        .createQueryBuilder()
        .update(Product)
        .set({
          discount: () => `
            CASE
              WHEN RAND() < 0.3 THEN 0.00
              ELSE ROUND(RAND() * 0.5, 2)
            END
          `,
        })
        .execute();

      console.log('4️⃣ Ambil ulang produk setelah flip');
      products = await manager
        .getRepository(Product)
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .select([
          'product.name AS name',
          'product.barcode AS barcode',
          'product.price AS price',
          'product.cost_price AS cost_price',
          'product.tax_rate AS tax_rate',
          'product.discount AS discount',
          'product.status AS status',
          'category.name AS category',
        ])
        .getRawMany();

      console.log('5️⃣ Generate transaksi Juli - Desember');
      dates = generateTransactionDates({ year: 2024, months: [7, 8, 9, 10, 11, 12], maxPerWeek: 9 });
      transactions = dates.map((d) => generateMockTransaction(generateMockCart(products, 1, 7), d));

      transactionEntities = transactions.map((t) =>
        manager.getRepository(Transaction).create({
          ...t,
          user: { id: t.user_id },
          items: t.items.map((item) => manager.getRepository(TransactionItem).create(item)),
        }),
      );
      await manager.save(transactionEntities);
      console.log('✅ Seed transactions Juli - Desember 2024');

      console.log('6️⃣ Flip diskon kedua, random lagi');
      await manager
        .createQueryBuilder()
        .update(Product)
        .set({
          discount: () => `
            CASE
              WHEN RAND() < 0.3 THEN 0.00
              ELSE ROUND(RAND() * 0.5, 2)
            END
          `,
        })
        .execute();

      console.log('✅ Final discount flip berhasil');
    });
  }
}
