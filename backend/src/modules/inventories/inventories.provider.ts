import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { MySQLConnection } from '~/infrastructure/database/database.provider';
import { REPOSITORY } from '~/common/constants/database';
import { Inventory } from './entities/inventory.entity';

export const inventoryProvider: Provider[] = [
  {
    provide: REPOSITORY.INVENTORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Inventory),
    inject: [MySQLConnection.provide],
  },
];
