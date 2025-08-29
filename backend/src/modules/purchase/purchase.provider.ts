import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { MySQLConnection } from '~/infrastructure/database/database.provider';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { REPOSITORY } from '~/common/constants/database';

export const purchaseProvider: Provider[] = [
  {
    provide: REPOSITORY.PURCHASE_ORDER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PurchaseOrder),
    inject: [MySQLConnection.provide],
  },
  {
    provide: REPOSITORY.PURCHASE_ORDER_ITEM,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PurchaseOrderItem),
    inject: [MySQLConnection.provide],
  },
];
