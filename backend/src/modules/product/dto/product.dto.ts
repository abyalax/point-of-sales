import { Expose, Type } from 'class-transformer';
import { EProductStatus } from '../product.interface';
import { CategoryDto } from './category-product.dto';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  barcode: string;

  @Expose()
  @IsNumber()
  price: string;

  @Expose()
  @IsNumber()
  cost_price: string;

  @Expose()
  @IsNumber()
  tax_rate: string;

  @Expose()
  @IsNumber()
  discount: string;

  @Expose()
  @IsEnum(EProductStatus)
  status: EProductStatus;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @IsNumber()
  stock: number;

  @Expose()
  @IsDate()
  created_at?: Date;

  @Expose()
  @IsDate()
  updated_at?: Date;
}
