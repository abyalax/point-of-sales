import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

import { PurchaseOrderItem } from '~/modules/purchase/entities/purchase-order-item.entity';
import { TransactionItem } from '~/modules/transaction/entities/transaction-item.entity';
import { PurchasePayment } from '~/modules/purchase/entities/purchase-payment.entity';
import { InventoryLog } from '~/modules/inventories/entities/inventory-log.entity';
import { PurchaseOrder } from '~/modules/purchase/entities/purchase-order.entity';
import { Transaction } from '~/modules/transaction/entities/transaction.entity';
import { Inventory } from '~/modules/inventories/entities/inventory.entity';
import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { Permission } from '~/modules/auth/entity/permission.entity';
import { Category } from '~/modules/product/entity/category.entity';
import { Product } from '~/modules/product/entity/product.entity';
import { DatabaseConfig } from '~/config/database.config';
import { User } from '~/modules/user/entity/user.entity';
import { Role } from '~/modules/auth/entity/role.entity';

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
      entities: [
        Category,
        Inventory,
        InventoryLog,
        PurchaseOrder,
        PurchaseOrderItem,
        PurchasePayment,
        Supplier,
        Product,
        User,
        Role,
        Permission,
        Transaction,
        TransactionItem,
      ],
    });
    return dataSource.initialize();
  },
};

export const createDatabaseProviders = (provide: string, options: DataSourceOptions): Provider[] => {
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
