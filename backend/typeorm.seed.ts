import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';
import { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Product } from '~/modules/product/entity/product.entity';
import { User } from '~/modules/user/entity/user.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { configDotenv } from 'dotenv';

configDotenv();
const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Role, Permission, Category, Inventory, Supplier, Product, Transaction, TransactionItem],
  synchronize: false,
  seeds: ['./src/infrastructure/database/seeds/*.seed.ts'],
};

export const dataSource = new DataSource(dataSourceOptions);
