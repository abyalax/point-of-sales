import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { MySQLConnection } from '~/infrastructure/database/database.provider';
import { REPOSITORY } from '~/common/constants/database';
import { Supplier } from './entities/supplier.entity';

export const supplierProvider: Provider[] = [
  {
    provide: REPOSITORY.SUPPLIER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Supplier),
    inject: [MySQLConnection.provide],
  },
];
