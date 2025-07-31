import { Module } from '@nestjs/common';

import { productProvider } from './product.provider';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from '../auth/auth.module';

import { DatabaseModule } from '~/infrastructure/database/database.module';
import { DATABASE } from '~/common/constants/database';

@Module({
  imports: [DatabaseModule.forRoot(DATABASE.MYSQL.PROVIDE, DATABASE.MYSQL.OPTIONS), AuthModule],
  providers: [...productProvider, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
