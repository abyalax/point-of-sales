import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class ProductTrendDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  periode: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  total_qty: number;
}
