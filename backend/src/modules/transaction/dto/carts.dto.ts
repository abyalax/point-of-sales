import { Exclude, Expose, Type } from 'class-transformer';
import { CartItemDto } from './cart-item.dto';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import { EPaymentMethod } from '../transaction.schema';

@Exclude()
export class CartDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @Expose()
  @IsString()
  sub_total: string;

  @Expose()
  @IsString()
  total: string;

  @Expose()
  @IsNumber()
  total_item: number;

  @Expose()
  @IsString()
  total_discount: string;

  @Expose()
  @IsEnum(EPaymentMethod)
  payment_method: EPaymentMethod;

  @Expose()
  @IsString()
  pay_received: string;

  @Expose()
  @IsString()
  pay_return: string;

  @Expose()
  @IsString()
  tax: string;

  @Expose()
  @IsString()
  notes: string;
}
