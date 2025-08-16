import { EStatusTransactions } from '../transaction.interface';
import { IsDate, IsNumberString, IsString } from 'class-validator';
import { User } from '~/modules/user/entity/user.entity';
import { Expose, Type } from 'class-transformer';

export class TransactionDto {
  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @IsString()
  cashier: string;

  @Expose()
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
  @IsNumberString()
  pay_return: string;

  @Expose()
  items: [];

  @Expose()
  @IsDate()
  created_at?: Date;

  @Expose()
  @IsDate()
  updated_at?: Date;
}
