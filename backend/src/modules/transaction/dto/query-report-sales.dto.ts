import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EStatusTransactions } from '../transaction.schema';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class QueryReportSales {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  year?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  month?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  week?: number;

  @Expose()
  @IsOptional()
  @IsString()
  start?: string;

  @Expose()
  @IsOptional()
  @IsString()
  end?: string;

  @Expose()
  @IsOptional()
  @IsEnum(EStatusTransactions)
  status?: EStatusTransactions;
}
