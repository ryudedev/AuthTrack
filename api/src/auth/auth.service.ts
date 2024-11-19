import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginResponseDto } from './dto/auth-login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly saltRounds = 14;

  async login(authLoginDto: AuthLoginDto): Promise<AuthLoginResponseDto> {
    try {
      // ユーザーを取得
      const record = await this.prisma.user.findUnique({
        where: { email: authLoginDto.email },
      });

      // ユーザーが存在しない場合
      if (!record) {
        throw new NotFoundException('User with this email does not exist');
      }

      // パスワードが一致しない場合
      const isPasswordMatching = await bcrypt.compare(
        authLoginDto.password,
        record.passwordHash,
      );
      if (!isPasswordMatching || record.email !== authLoginDto.email) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // アクセストークンを生成
      const access_token = await this.generateToken({
        id: record.id,
        email: record.email,
      });

      // ユーザーを返す
      return { access_token };
    } catch (error) {
      // エラーハンドリング
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        // 既知のエラーの場合
        throw error;
      } else {
        // 必要に応じてカスタム例外を投げる
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }

  async register(authLoginDto: AuthLoginDto): Promise<AuthResponseDto> {
    const hashedPassword = await this.hashPassword(authLoginDto.password);
    try {
      // ユーザーを作成
      const record = await this.prisma.user.create({
        data: {
          email: authLoginDto.email,
          passwordHash: hashedPassword,
        },
      });

      // ユーザーを返す
      return record;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // すでに登録されているユーザーの場合
          throw new ConflictException('User with this email already exists');
        }
      }

      // それ以外のエラーの場合
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  // JWTトークンのペイロードからユーザーIDを使用して、データベースからユーザー情報を取得
  async getUserFromToken(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async generateToken(user: { id: string; email: string }): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
