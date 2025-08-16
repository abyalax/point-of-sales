import { DataSource } from 'typeorm';

import { DATABASE, REPOSITORY } from '~/common/constants/database';
import { Transaction } from './entities/transaction.entity';
import { User } from '../user/entity/user.entity';
import { TransactionItem } from './entities/transaction-item.entity';

export const transactionProvider = [
  {
    provide: REPOSITORY.TRANSACTION,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Transaction),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
  {
    provide: REPOSITORY.TRANSACTION_ITEM,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TransactionItem),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
  {
    provide: REPOSITORY.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
];
