import { IsBoolean, IsDateString, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

import { CreateCategoryDto } from '~/modules/product/dto/create-category.dto';
import { Inventory } from '~/modules/inventories/entities/inventory.entity';

@Exclude()
export class CreateSupplierDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  address: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsBoolean()
  is_active: boolean;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  category_id: number;

  @Expose()
  @ValidateNested()
  @Type(() => CreateCategoryDto)
  category: CreateCategoryDto;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => Inventory)
  inventories?: Inventory[];

  @Expose()
  @IsDateString()
  created_at?: string;

  @Expose()
  @IsDateString()
  updated_at?: string;
}
