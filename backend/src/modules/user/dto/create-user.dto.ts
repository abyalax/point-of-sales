import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  password: string;
}
