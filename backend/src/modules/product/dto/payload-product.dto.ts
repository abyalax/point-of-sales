import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EProductStatus } from '../product.interface';
import { Expose } from 'class-transformer';

export class PayloadProductDto {
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
  @IsNumber()
  stock: number;

  @Expose()
  @IsString()
  category: string;
}
