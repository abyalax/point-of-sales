import { DataSourceOptions } from 'typeorm';

import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';
import { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Product } from '~/modules/product/entity/product.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { User } from '~/modules/user/entity/user.entity';
import { configDotenv } from 'dotenv';

configDotenv();

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
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      dateStrings: false,
      entities: [User, Role, Permission, Category, Inventory, Supplier, Product, Transaction, TransactionItem],
      synchronize: false,
    },
  },
};
