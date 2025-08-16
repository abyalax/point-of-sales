import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsString } from 'class-validator';
import { RoleDto } from '~/modules/auth/dto/role/get-role.dto';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Exclude()
  @IsString()
  password?: string;

  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];

  @Expose()
  @IsArray()
  permissions: string[];

  @Exclude()
  @IsDate()
  created_at?: Date;

  @Exclude()
  @IsDate()
  updated_at?: Date;
}
