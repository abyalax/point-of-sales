import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { EStatusTransactions } from '../transaction.schema';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class QueryReportSales {
  @Expose()
  @IsOptional()
  @IsNumberString()
  year?: number;

  @Expose()
  @IsOptional()
  @IsNumberString()
  month?: number;

  @Expose()
  @IsOptional()
  @IsNumberString()
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
