import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsNumberString, IsString } from 'class-validator';

@Exclude()
export class CartItemDto {
  @Expose()
  @IsNumber()
  id: number;

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
  @IsNumber()
  quantity: number;
}
