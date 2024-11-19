# AuthTrack
## AuthTrackとは
ユーザー認証とログ管理に焦点を当てた簡潔で効果的なWebアプリケーションです。このプロジェクトでは、ユーザーのログイン履歴を追跡し、管理者がその情報を容易に管理・分析できるシステムを提供することを目的としています。

## 機能一覧

### **1. ユーザー機能**
#### **1.1 認証機能**
- **ログイン**: メールアドレスとパスワードによる認証。
- **JWTセッション管理**: 成功時にトークンを発行し、以降の操作で認証。
- **ログアウト**: セッション終了機能。

---

### **2. 管理者機能**
#### **2.1 ログ管理**
- **ログ一覧表示**: 全ユーザーのログイン履歴をテーブル形式で表示。
  - **項目例**: ユーザー名、日時、IPアドレス、デバイス情報、ステータス（成功/失敗）。
- **フィルタリング**:  
  - ユーザー名、日付範囲、成功/失敗などで検索可能。
- **ログの詳細表示**:  
  - ログイン試行時の詳細情報（失敗理由、ブラウザ情報など）を表示。
- **エクスポート機能**:  
  - CSVまたはJSON形式でログデータを出力。

#### **2.2 ユーザー管理**（拡張機能として検討可）
- ユーザーのアカウント状態（有効/無効）を管理。
- 新規ユーザーの追加や削除。

---

### **3. セキュリティ機能**
- **パスワード管理**: bcryptでハッシュ化し、データベースに保存。
- **レートリミット**:  
  - 短期間での連続ログイン試行を防止。
  - 試行回数が一定を超えると一時的にアカウントをロック。
- **CORS対策**: セキュアなAPI通信を保証。

---

### **4. システム管理機能**
- **監査ログ**: 管理者操作の記録（閲覧履歴やエクスポート履歴）。
- **エラーログ**: システムエラーや不正なAPIアクセスの記録。

---