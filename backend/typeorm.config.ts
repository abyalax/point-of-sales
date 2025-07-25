//* It Does Not Support Path Alias Shorthand */
import { DataSource } from 'typeorm';
import { Product } from './src/modules/product/entity/product.entity';
import { User } from './src/modules/user/user.entity';
import { Role } from './src/modules/auth/entity/role.entity';
import { Permission } from './src/modules/auth/entity/permission.entity';
import { Category } from './src/modules/product/entity/category.entity';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'db_boilerplate_v1',
  entities: [Category, Product, User, Role, Permission],
  migrations: ['./src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
