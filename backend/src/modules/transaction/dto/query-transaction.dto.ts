import { MetaRequestDto } from '~/common/dto/meta-request.dto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsEnum, IsString } from 'class-validator';
import { EPaymentMethod, EStatusTransactions } from '../transaction.schema';

@Exclude()
export class QueryTransactionDto extends MetaRequestDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  min_total_tax?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  max_total_tax?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  min_total_discount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  max_total_discount?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  min_total_price?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  max_total_price?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  min_total_profit?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  max_total_profit?: number;

  @Expose()
  @IsOptional()
  @IsEnum(EPaymentMethod)
  payment_method?: EPaymentMethod;

  @Expose()
  @IsOptional()
  @IsEnum(EStatusTransactions)
  status?: EStatusTransactions;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  user_id?: number;

  @Expose()
  @IsOptional()
  @IsString()
  created_at?: string;

  @Expose()
  @IsOptional()
  @IsString()
  updated_at?: string;
}
