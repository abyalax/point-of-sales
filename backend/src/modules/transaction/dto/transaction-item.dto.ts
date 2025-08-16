import { IsDate, IsNumber, IsNumberString, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Transaction } from '../entities/transaction.entity';

export class TransactionItemDto {
  @IsString()
  barcode: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  quantity: number;

  @IsNumberString()
  price: string;

  @IsNumberString()
  cost_price: string;

  @IsNumberString()
  sell_price: string;

  @IsNumberString()
  final_price: string;

  @IsNumberString()
  tax_rate: string;

  @IsNumberString()
  discount: string;

  @Type(() => Transaction)
  transaction: Transaction;

  @Expose()
  @IsDate()
  created_at?: Date;

  @Expose()
  @IsDate()
  updated_at?: Date;
}
