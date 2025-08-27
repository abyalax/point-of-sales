import { IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { User } from '~/modules/user/entity/user.entity';
import { Expose, Type } from 'class-transformer';
import { TransactionItemDto } from './transaction-item.dto';
import { EPaymentMethod, EStatusTransactions } from '../transaction.schema';

export class TransactionDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @IsString()
  cashier: string;

  @Expose()
  @IsEnum(EStatusTransactions)
  status: EStatusTransactions;

  @Expose()
  @IsNumberString()
  sub_total: string;

  @Expose()
  @IsNumberString()
  total_discount: string;

  @Expose()
  @IsNumberString()
  total_price: string;

  @Expose()
  @IsNumberString()
  total_profit: string;

  @Expose()
  @IsNumberString()
  total_tax: string;

  @Expose()
  @IsNumberString()
  last_price: string;

  @Expose()
  @IsNumberString()
  pay_received: string;

  @Expose()
  @IsEnum(EPaymentMethod)
  payment_method: EPaymentMethod;

  @Expose()
  @IsNumberString()
  pay_return: string;

  @Expose()
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];

  @Expose()
  @IsOptional()
  @IsString()
  note?: string;

  @Expose()
  @IsDateString()
  created_at?: string;

  @Expose()
  @IsDateString()
  updated_at?: string;
}
