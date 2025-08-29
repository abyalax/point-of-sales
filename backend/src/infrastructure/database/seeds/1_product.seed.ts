import { Category } from '~/modules/product/entity/category.entity';
import { Product } from '~/modules/product/entity/product.entity';
import { mockCategories } from '../mock/products/category.mock';
import { mockProducts } from '../mock/products/products.mock';
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class ProductSeeder implements Seeder {
  track = true;
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM products');
    await dataSource.query('DELETE FROM categories');

    const repositoryCategory = dataSource.getRepository(Category);
    await repositoryCategory.insert(mockCategories);
    console.log('✅ Seed categories successfully');

    const repository = dataSource.getRepository(Product);
    await repository.save(mockProducts);
    console.log('✅ Seed products successfully');
  }
}
