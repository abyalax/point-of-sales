import type { Category } from '~/modules/product/entity/category.entity';
import type { Product } from '~/modules/product/entity/product.entity';

export type RowProducts = Omit<Product, 'category'> & {
  category_id: number;
  category_name: string;
  category_created_at: string;
  category_updated_at: string;
};

export function mapProductRows(rows: RowProducts[]): Product[] {
  const categoryCache = new Map<number, Category>();
  const products: Product[] = [];

  for (const row of rows) {
    let category = categoryCache.get(row.category_id);

    if (!category) {
      category = {
        id: row.category_id,
        name: row.category_name,
        created_at: row.category_created_at,
        updated_at: row.category_updated_at,
      };
      categoryCache.set(category.id, category);
    }

    const product: Product = {
      id: row.id,
      name: row.name,
      barcode: row.barcode,
      cost_price: row.cost_price,
      discount: row.discount,
      tax_rate: row.tax_rate,
      category_id: row.category_id,
      category: category,
      price: row.price,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    products.push(product);
  }

  return products;
}
