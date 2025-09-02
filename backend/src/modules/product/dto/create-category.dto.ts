import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateCategoryDto {
  @Expose()
  @IsString({ message: 'Category name must be a string' })
  name: string;
}
