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
import { User } from '~/modules/user/entity/user.entity';
import { Role } from '~/modules/auth/entity/role.entity';

import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';

configDotenv();

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
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
  migrations: ['./src/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
