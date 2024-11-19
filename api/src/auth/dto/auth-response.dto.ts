import { IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class AuthResponseDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
