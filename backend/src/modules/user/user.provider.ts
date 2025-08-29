import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { MySQLConnection } from '~/infrastructure/database/database.provider';
import { Permission } from '../auth/entity/permission.entity';
import { REPOSITORY } from '~/common/constants/database';
import { Role } from '../auth/entity/role.entity';
import { User } from './entity/user.entity';

export const userProvider: Provider[] = [
  {
    provide: REPOSITORY.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [MySQLConnection.provide],
  },
  {
    provide: REPOSITORY.PERMISSION,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Permission),
    inject: [MySQLConnection.provide],
  },
  {
    provide: REPOSITORY.ROLE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: [MySQLConnection.provide],
  },
];
