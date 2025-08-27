import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ProductFrequencySoldDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  category: string;

  @Expose()
  @IsNumber()
  total_product: number;
}
