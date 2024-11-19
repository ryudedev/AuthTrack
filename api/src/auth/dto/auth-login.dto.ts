import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(16)
  @IsNotEmpty()
  password: string;
}
