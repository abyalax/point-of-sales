import { IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EProductStatus } from '../product.interface';
import { Expose } from 'class-transformer';

export class PayloadProductDto {
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
  @IsString()
  category: string;
}
