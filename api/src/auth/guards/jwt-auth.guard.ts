import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.access_token; // クッキーに保存されたJWTを取得

    if (!token) {
      throw new UnauthorizedException('token not found');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user; // トークンからデコードしたユーザー情報をリクエストにセット
      return true;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
