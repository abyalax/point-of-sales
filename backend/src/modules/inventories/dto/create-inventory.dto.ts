import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsNumberString } from 'class-validator';

@Exclude()
export class CreateInventoryDto {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @Expose()
  @IsNumberString()
  barcode: string;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  stock: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  min_stock: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  max_stock: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  supplier_id?: number;
}
