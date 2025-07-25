import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { EngineSide } from '../types/meta';

@Exclude()
export class MetaRequestDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  page?: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsNumber()
  per_page?: number;

  @Expose()
  @IsOptional()
  @IsString()
  sort_by?: string;

  @Expose()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC';

  @Expose()
  @IsOptional()
  @IsString()
  search?: string;

  @Expose()
  @IsOptional()
  @IsEnum(['client_side', 'server_side'])
  engine?: EngineSide;
}
