import { Exclude, Expose, Type } from 'class-transformer';
import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
import { PermissionsDto } from '~/modules/auth/dto/permission/get-permission.dto';
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
  @IsOptional()
  password?: string;

  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];

  @Expose()
  @Type(() => PermissionsDto)
  permissions: string[];

  @Exclude()
  @IsDateString()
  @IsOptional()
  created_at?: string;

  @Exclude()
  @IsDateString()
  @IsOptional()
  updated_at?: string;
}
