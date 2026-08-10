import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '@food-tower/types';

export class RegisterDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
