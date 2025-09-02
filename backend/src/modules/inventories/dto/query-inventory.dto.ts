import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { MetaRequestDto } from '~/common/dto/meta-request.dto';

@Exclude()
export class QueryInventoryDto extends MetaRequestDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  min_stock: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  max_stock: number;
}
