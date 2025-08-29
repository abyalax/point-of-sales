import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class CreateInventoryDto {
  @Expose()
  @IsNumber()
  product_id: number;

  @Expose()
  @IsNumber()
  stock: number;

  @Expose()
  @IsNumber()
  min_stock: number;

  @Expose()
  @IsNumber()
  max_stock: number;

  @Expose()
  @IsNumber()
  supplier_id?: number;
}
