import { IsDateString, IsNumber, IsNumberString, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Transaction } from '../entities/transaction.entity';

export class TransactionItemDto {
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
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @Expose()
  @IsNumberString()
  price: string;

  @Expose()
  @IsNumberString()
  cost_price: string;

  @Expose()
  @IsNumberString()
  sell_price: string;

  @Expose()
  @IsNumberString()
  final_price: string;

  @Expose()
  @IsNumberString()
  tax_rate: string;

  @Expose()
  @IsNumberString()
  discount: string;

  @Expose()
  @Type(() => Transaction)
  transaction: Transaction;

  @Expose()
  @IsDateString()
  created_at?: string;

  @Expose()
  @IsDateString()
  updated_at?: string;
}
