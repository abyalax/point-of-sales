import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { EProductStatus } from '../product.interface';
import { MetaRequestDto } from '~/common/dto/meta-request.dto';

@Exclude()
export class QueryProductDto extends MetaRequestDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  min_price?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  max_price?: number;

  @Expose()
  @IsOptional()
  @IsEnum(EProductStatus)
  status?: EProductStatus;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  category?: number;
}
