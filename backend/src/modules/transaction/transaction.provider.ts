import { DataSource } from 'typeorm';

import { MySQLConnection } from '~/infrastructure/database/database.provider';
import { TransactionItem } from './entities/transaction-item.entity';
import { Transaction } from './entities/transaction.entity';
import { REPOSITORY } from '~/common/constants/database';
import { User } from '../user/entity/user.entity';

export const transactionProvider = [
  {
    provide: REPOSITORY.TRANSACTION,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Transaction),
    inject: [MySQLConnection.provide],
  },
  {
    provide: REPOSITORY.TRANSACTION_ITEM,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionItem),
    inject: [MySQLConnection.provide],
  },
  {
    provide: REPOSITORY.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [MySQLConnection.provide],
  },
];
