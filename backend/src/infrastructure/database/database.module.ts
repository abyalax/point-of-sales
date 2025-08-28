import { DynamicModule, Module } from '@nestjs/common';
import { MySQLConnection, createDatabaseProviders } from './database.provider';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [MySQLConnection, ConfigService],
  exports: [MySQLConnection, ConfigService],
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
