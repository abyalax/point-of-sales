import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class PermissionsDto {
  @Expose()
  id: number;

  @Expose()
  @IsString()
  key: string;

  @Expose()
  @IsString()
  name: string;
}
