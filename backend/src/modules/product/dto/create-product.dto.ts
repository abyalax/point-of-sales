import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EProductStatus } from '../product.schema';
import { Exclude, Expose } from 'class-transformer';

// TODO: add min stock and max stock
@Exclude()
export class CreateProductDto {
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
  @IsString()
  category: string;

  @Expose()
  @IsNumber()
  stock: number;

  @Expose()
  @IsNumber()
  min_stock: number;

  @Expose()
  @IsNumber()
  max_stock: number;
}
