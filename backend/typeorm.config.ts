import { DataSource } from 'typeorm';
import { Product } from '~/modules/product/entity/product.entity';
import { User } from '~/modules/user/entity/user.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';
import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { configDotenv } from 'dotenv';

configDotenv();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Category, Product, User, Role, Permission, Transaction, TransactionItem],
  migrations: ['./src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
