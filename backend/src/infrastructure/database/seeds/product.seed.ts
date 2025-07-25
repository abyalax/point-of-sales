//* It Does Not Support Path Alias Shorthand */
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { mockCategories, mockProducts } from '../mock/product.mock';
import { Product } from '../../../modules/product/entity/product.entity';
import { Category } from '../../../modules/product/entity/category.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM products');
    await dataSource.query('DELETE FROM categories');

    const repositoryCategory = dataSource.getRepository(Category);
    await repositoryCategory.insert(mockCategories);
    console.log('✅ Category Seeded Successfully');

    const repository = dataSource.getRepository(Product);
    await repository.save(mockProducts);
    console.log('✅ Product Seeded Successfully');
  }
}
