import { DataSource } from 'typeorm';

import { REPOSITORY } from '~/common/constants/database';
import { Product } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { MySQLConnection } from '~/infrastructure/database/database.provider';
import { Provider } from '@nestjs/common';

export const productProvider: Provider[] = [
  {
    provide: REPOSITORY.PRODUCT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [MySQLConnection.provide],
  },
  {
    provide: REPOSITORY.CATEGORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [MySQLConnection.provide],
  },
];
