import { REPOSITORY } from '~/common/constants/database';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { Permission } from '../auth/entity/permission.entity';
import { Role } from '../auth/entity/role.entity';
import { MySQLConnection } from '~/infrastructure/database/database.provider';

export const userProvider = [
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
