import { IsDateString, IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { CategoryDto } from './category-product.dto';
import { EProductStatus } from '../product.schema';
import { Expose, Type } from 'class-transformer';

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
  @IsNumberString()
  price: string;

  @Expose()
  @IsNumberString()
  cost_price: string;

  @Expose()
  @IsNumberString()
  tax_rate: string;

  @Expose()
  @IsNumberString()
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
  @IsDateString()
  created_at?: string;

  @Expose()
  @IsDateString()
  updated_at?: string;
}
