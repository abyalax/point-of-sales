import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { EProductStatus } from '../product.schema';
import { Expose, Type } from 'class-transformer';

export class PayloadProductDto {
  @Expose()
  @IsString()
  @IsOptional()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  barcode: string;

  @Expose()
  @IsNumberString()
  @IsOptional()
  price: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  cost_price: string;

  @Expose()
  @IsNumberString()
  @IsOptional()
  tax_rate: string;

  @Expose()
  @IsNumberString()
  @IsOptional()
  discount: string;

  @Expose()
  @IsEnum(EProductStatus)
  @IsOptional()
  status: EProductStatus;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  stock: number;

  @Expose()
  @IsString()
  @IsOptional()
  category: string;
}
