import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EProductStatus } from '../product.interface';
import { CategoryDto } from './category-product.dto';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumberString()
  price: string;

  @IsEnum(EProductStatus)
  status: EProductStatus;

  @IsNumber()
  stock: number;

  @Type(() => CategoryDto)
  category: CategoryDto;
}
