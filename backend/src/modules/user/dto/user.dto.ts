import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDto } from '~/modules/auth/dto/role/get-role.dto';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Exclude()
  password?: string;

  @Expose()
  @Type(() => RoleDto)
  roles: RoleDto[];

  @Expose()
  permissions: string[];

  @Exclude()
  created_at?: Date;

  @Exclude()
  updated_at?: Date;
}
