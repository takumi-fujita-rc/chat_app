# AIチャットアプリ

OpenAI GPT-4o を使ったシンプルなチャットボットアプリです。Next.js (App Router) + TypeScript + Tailwind CSS で構築されています。

## 検証レポート

CCAGI SDK を使った開発フロー（要件定義→設計→実装→テスト→GitHub管理）の検証レポートです。

[検証レポートを見る](https://takumi-fujita-rc.github.io/chat_app/report/verification-report.html)　｜　[エグゼクティブサマリーを見る](https://takumi-fujita-rc.github.io/chat_app/report/summary-report.html)

## 機能

- ログイン認証（ID/パスワード）
- リアルタイムチャット（OpenAI GPT-4o）
- 会話履歴の管理（複数ターン対応）
- Enter キー送信 / Shift+Enter で改行
- 日本語IME対応（変換確定時に誤送信しない）
- 会話リセット（送信中のリクエストもキャンセル）
- レスポンシブ対応（モバイル〜デスクトップ）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript (strict) |
| スタイリング | Tailwind CSS |
| AI | OpenAI GPT-4o (`openai` SDK v4) |
| 認証 | NextAuth.js v5 (Credentials Provider) |
| テスト | Playwright (E2E) |
| Node.js | v20 以上推奨 |

## ディレクトリ構成

```
chat_app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth API Route
│   │   │   └── chat/route.ts                # OpenAI API Route (Server)
│   │   ├── login/page.tsx      # ログイン画面
│   │   ├── page.tsx            # チャット画面 (Client Component)
│   │   └── layout.tsx          # ルートレイアウト
│   ├── auth.ts                 # NextAuth 設定
│   ├── middleware.ts            # 認証ミドルウェア
│   ├── components/
│   │   ├── ChatInput.tsx       # 入力フォーム
│   │   ├── ChatMessage.tsx     # メッセージバブル
│   │   └── LoadingIndicator.tsx
│   └── types/
│       └── chat.ts             # 型定義
├── tests/
│   └── e2e/
│       ├── auth.pw.ts          # 認証 E2E テスト（5件）
│       └── chat.pw.ts          # チャット E2E テスト（8件）
├── Makefile                    # テスト実行コマンド
├── playwright.auth.config.ts   # 認証テスト用 Playwright 設定
├── playwright.chat.config.ts   # チャットテスト用 Playwright 設定
├── docs/
│   ├── requirements/           # 要件定義書
│   ├── diagrams/               # シーケンス・アーキテクチャ図
│   ├── test-designs/           # テスト設計書
│   └── report/                 # 検証レポート
└── .env.local                  # 環境変数（git 管理外）
```

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/takumi-fujita-rc/chat_app.git
cd chat_app
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env.local` を作成し、以下を設定します。

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
AUTH_SECRET=<32文字以上のランダム文字列>
AUTH_EMAIL=admin@example.com
AUTH_PASSWORD=your-password
```

| 変数 | 説明 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API キー（[platform.openai.com](https://platform.openai.com/api-keys) で取得） |
| `AUTH_SECRET` | セッション署名用シークレット（`openssl rand -base64 32` で生成） |
| `AUTH_EMAIL` | ログイン用メールアドレス |
| `AUTH_PASSWORD` | ログイン用パスワード |

### 4. 開発サーバーの起動

```bash
make dev
# または
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 利用可能なコマンド

### Make コマンド

| コマンド | 説明 |
|---------|------|
| `make test` | 全E2Eテスト実行（認証 + チャット） |
| `make test-auth` | 認証テストのみ実行 |
| `make test-chat` | チャットテストのみ実行 |
| `make test-headed` | ブラウザ表示でテスト実行（視覚確認用） |
| `make dev` | 開発サーバー起動 |
| `make build` | プロダクションビルド |

### npm スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm run type-check` | TypeScript 型チェック |

## テスト

事前に開発サーバーを起動した状態で実行してください。

```bash
# 全テスト一括実行（推奨）
make test

# ブラウザを表示しながら実行（slowMo: 800ms）
make test-headed
```

### テストケース一覧

#### 認証テスト（auth.pw.ts）

| ID | 内容 |
|----|------|
| AUTH-001 | 未認証アクセス — ログイン画面にリダイレクト |
| AUTH-002 | ログイン失敗 — エラーメッセージ表示 |
| AUTH-003 | ログイン成功 — チャット画面に遷移 |
| AUTH-004 | ログアウト — ログイン画面に戻る |
| AUTH-005 | 認証済みユーザーが /login にアクセス — チャット画面にリダイレクト |

#### チャットテスト（chat.pw.ts）

| ID | 内容 |
|----|------|
| E2E-001 | 初期表示 — 空の状態が表示される |
| E2E-002 | メッセージ送信 — ユーザーメッセージが表示される |
| E2E-003 | AIレスポンス受信 — AIの返答が表示される |
| E2E-004 | Enterキー送信 |
| E2E-005 | Shift+Enterで改行（送信されない） |
| E2E-006 | 会話リセット |
| E2E-007 | レスポンシブ — モバイル表示 |
| E2E-008 | 空文字送信 — 送信されない |

## API

### POST /api/chat

チャットメッセージを OpenAI GPT-4o に送信し、返答を取得します。

**リクエスト**

```json
{
  "messages": [
    { "role": "user", "content": "こんにちは" }
  ]
}
```

**レスポンス (200)**

```json
{
  "message": "こんにちは！何かお手伝いできることはありますか？"
}
```

**エラーレスポンス**

| ステータス | 内容 |
|----------|------|
| 400 | メッセージが空 |
| 500 | OpenAI API エラー |

## ライセンス

MIT
