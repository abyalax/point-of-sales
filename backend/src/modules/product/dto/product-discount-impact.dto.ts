import { Expose } from 'class-transformer';
import { IsNumberString, IsString } from 'class-validator';

export class ProductDiscountImpactDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumberString()
  with_discount: number;

  @Expose()
  @IsNumberString()
  without_discount: number;
}
