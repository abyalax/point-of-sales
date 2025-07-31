import { DATABASE, REPOSITORY } from '~/common/constants/database';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';
import { Permission } from '../auth/entity/permission.entity';
import { Role } from '../auth/entity/role.entity';

export const userProvider = [
  {
    provide: REPOSITORY.USER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
  {
    provide: REPOSITORY.PERMISSION,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Permission),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
  {
    provide: REPOSITORY.ROLE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: [DATABASE.MYSQL.PROVIDE],
  },
];
