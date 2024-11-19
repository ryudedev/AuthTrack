import { IsString } from 'class-validator';

export class AuthLoginResponseDto {
  @IsString()
  access_token: string;
}
