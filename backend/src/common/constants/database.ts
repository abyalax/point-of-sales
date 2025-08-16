import { DataSourceOptions } from 'typeorm';

import { Product } from '~/modules/product/entity/product.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { User } from '~/modules/user/entity/user.entity';
import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';

type TDatabaseCollection = 'MYSQL';

type TDatabaseOptions = {
  [K in TDatabaseCollection]: {
    PROVIDE: string;
    OPTIONS: DataSourceOptions;
  };
};

export const REPOSITORY = {
  PRODUCT: 'product_repository',
  USER: 'user_repository',
  PERMISSION: 'permission_repository',
  ROLE: 'role_repository',
  CATEGORY: 'category_repository',
  TRANSACTION: 'transaction_repository',
  TRANSACTION_ITEM: 'transaction_item_repository',
};

export const DATABASE: TDatabaseOptions = {
  MYSQL: {
    PROVIDE: 'mysql_connection',
    OPTIONS: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_point_of_sales',
      dateStrings: false,
      entities: [Category, Product, User, Role, Permission, Transaction, TransactionItem],
      synchronize: false,
    },
  },
};
