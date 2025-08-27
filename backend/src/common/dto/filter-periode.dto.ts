import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';

@Exclude()
export class FilterPeriodeDto {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month?: number;

  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  week?: number;

  @Expose()
  @IsOptional()
  @IsDateString()
  start?: string;

  @Expose()
  @IsOptional()
  @IsDateString()
  end?: string;
}
