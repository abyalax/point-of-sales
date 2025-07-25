import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductDto } from './product.dto';
import { Exclude, Expose, Type } from 'class-transformer';

export class CreateCategoryDto {
  @Expose()
  @IsString({ message: 'Category name must be a string' })
  name: string;
}

@Exclude()
export class CategoryDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @Type(() => ProductDto)
  products?: ProductDto[];

  @Expose()
  @IsOptional()
  @IsString()
  created_at?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  updated_at?: Date;
}
