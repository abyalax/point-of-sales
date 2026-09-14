import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';

import { InventoriesModule } from './modules/inventories/inventories.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurchaseModule } from './modules/purchase/purchase.module';

import databaseConfig from './infrastructure/config/database.config';
import cookieConfig from './infrastructure/config/cookie.config';
import jwtConfig from './infrastructure/config/jwt.config';
import httpConfig from './infrastructure/config/http.config';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { closeConnection } from './infrastructure/database/database.provider';
import { GlobalExceptionFilter } from './common/filters/global.filter';

const gracefulShutdownImports =
  process.env.NODE_ENV === 'test'
    ? []
    : [
        GracefulShutdownModule.forRoot({
          cleanup: async (_, signal) => {
            const logger = new Logger('GracefulShutdown');
            logger.log(`Shutting down gracefully due to signal: ${signal}`);
            await closeConnection();
            logger.log('Database connection closed.');
          },
          gracefulShutdownTimeout: Number(process.env.GRACEFUL_SHUTDOWN_TIMEOUT ?? 10000),
          keepNodeProcessAlive: true,
        }),
      ];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig, jwtConfig, cookieConfig, httpConfig] }),
    ProductModule,
    AuthModule,
    UserModule,
    TransactionModule,
    SupplierModule,
    InventoriesModule,
    ...gracefulShutdownImports,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    PurchaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GlobalExceptionFilter,
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
