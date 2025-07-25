import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EProductStatus } from '../product.interface';
import { CategoryDto } from './category-product.dto';
import { Expose, Type } from 'class-transformer';

export class UpdateProductDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumberString()
  price: string;

  @Expose()
  @IsEnum(EProductStatus)
  status: EProductStatus;

  @Expose()
  @IsNumber()
  stock: number;

  @Expose()
  @Type(() => CategoryDto)
  category: CategoryDto;
}
