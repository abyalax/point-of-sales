import { DataSource, DataSourceOptions } from 'typeorm';
import { DATABASE } from '~/common/constants/database';

export const Connection = {
  provide: DATABASE.MYSQL.PROVIDE,
  useFactory: async () => {
    const dataSource = new DataSource(DATABASE.MYSQL.OPTIONS);
    return dataSource.initialize();
  },
};

export const createDatabaseProviders = (provide: string, options: DataSourceOptions) => {
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
