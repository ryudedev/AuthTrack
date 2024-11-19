// src/types/express/index.d.ts

import { User } from '@prisma/client'; // 必要に応じてユーザー型をインポート

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
      }; // ユーザー情報を `req.user` として定義
    }
  }
}
