import { DynamicModule, Module } from '@nestjs/common';
import { Connection, createDatabaseProviders } from './database.provider';
import { DataSourceOptions } from 'typeorm';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(provide: string, options: DataSourceOptions): DynamicModule {
    const providers = createDatabaseProviders(provide, options);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
