import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto, @Res() res: Response) {
    const token = await this.authService.login(authLoginDto);

    res.cookie('access_token', token.access_token, {
      httpOnly: true, // JavaScriptからアクセス不可
      secure: process.env.NODE_ENV === 'production', // HTTPS接続時のみ送信
      sameSite: 'strict', // CSRF対策
      maxAge: 900000, // 15分の有効期限
    });

    return res.status(200).json(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res() res: Response) {
    // クッキーから 'access_token' を削除する
    res.clearCookie('access_token', {
      httpOnly: true, // JavaScriptからのアクセス不可
      secure: process.env.NODE_ENV === 'production', // HTTPS接続時のみ
      sameSite: 'strict', // CSRF対策
    });

    // ログアウト成功のメッセージを返す
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  }

  @Post('register')
  register(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.register(authLoginDto);
  }

  @UseGuards(JwtAuthGuard) // JWTガードで認証を行う
  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const user = await this.authService.getUserFromToken(req.user.sub); // トークンからユーザー情報を取得
    return res.status(200).json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
