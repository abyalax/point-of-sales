import { DataSource } from 'typeorm';

import { DATABASE, REPOSITORY } from '~/common/constants/database';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';

export const productProvider = [
  {
    provide: REPOSITORY.PRODUCT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
  {
    provide: REPOSITORY.CATEGORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
];
