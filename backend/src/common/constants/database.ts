import { DataSourceOptions } from 'typeorm';

import { Product } from '~/modules/product/entity/product.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { User } from '~/modules/user/user.entity';

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
      database: 'db_boilerplate_v1',
      dateStrings: false,
      entities: [Category, Product, User, Role, Permission],
      synchronize: false,
    },
  },
};
