import { Exclude, Expose, Type } from 'class-transformer';
import { EPaymentMethod } from '../transaction.interface';
import { CartItemDto } from './cart-item.dto';
import { IsEnum, IsNumber, IsNumberString, IsString, ValidateNested } from 'class-validator';

@Exclude()
export class CartDto {
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @Expose()
  @IsNumberString()
  sub_total: string;

  @Expose()
  @IsNumberString()
  total: string;

  @Expose()
  @IsNumber()
  total_item: number;

  @Expose()
  @IsNumberString()
  total_discount: string;

  @Expose()
  @IsEnum(EPaymentMethod)
  payment_method: EPaymentMethod;

  @Expose()
  @IsNumberString()
  pay_received: string;

  @Expose()
  @IsNumberString()
  pay_return: string;

  @Expose()
  @IsNumberString()
  tax: string;

  @Expose()
  @IsString()
  notes: string;
}
