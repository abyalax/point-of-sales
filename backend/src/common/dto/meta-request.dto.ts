import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { EngineSide } from '../types/meta';

@Exclude()
export class MetaRequestDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public page?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public per_page?: number;

  @Expose()
  @IsOptional()
  @IsString()
  public sort_by?: string;

  @Expose()
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  public sort_order?: 'ASC' | 'DESC';

  @Expose()
  @IsOptional()
  @IsString()
  public search?: string;

  @Expose()
  @IsOptional()
  @IsEnum(['client_side', 'server_side'])
  public engine?: EngineSide;
}
