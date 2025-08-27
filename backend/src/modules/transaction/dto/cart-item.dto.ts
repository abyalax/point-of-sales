import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class CartItemDto {
  @Expose()
  @IsString()
  barcode: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  category: string;

  @Expose()
  @IsString()
  price: string;

  @Expose()
  @IsString()
  cost_price: string;

  @Expose()
  @IsString()
  tax_rate: string;

  @Expose()
  @IsString()
  discount: string;

  @Expose()
  @IsNumber()
  quantity: number;
}
