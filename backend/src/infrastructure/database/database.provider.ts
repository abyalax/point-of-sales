import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';
import { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Product } from '~/modules/product/entity/product.entity';
import { User } from '~/modules/user/entity/user.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { DatabaseConfig } from '~/config/database.config';

export const MySQLConnection = {
  provide: 'mysql_connection',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const database = configService.get<DatabaseConfig>('database')!;
    const dataSource = new DataSource({
      type: 'mysql',
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.database,
      synchronize: false,
      dateStrings: true,
      entities: [Category, Inventory, Supplier, Product, User, Role, Permission, Transaction, TransactionItem],
    });
    return dataSource.initialize();
  },
};

export const createDatabaseProviders = (provide: string, options: DataSourceOptions) => {
  return [
    {
      provide,
      useFactory: async () => {
        const dataSource = new DataSource(options);
        return dataSource.initialize();
      },
    },
  ];
};
