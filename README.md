# AIチャットアプリ

OpenAI GPT-4o を使ったシンプルなチャットボットアプリです。Next.js (App Router) + TypeScript + Tailwind CSS で構築されています。

## 検証レポート

CCAGI SDK を使った開発フロー（要件定義→設計→実装→テスト→GitHub管理）の検証レポートです。

[検証レポートを見る](https://htmlpreview.github.io/?https://raw.githubusercontent.com/takumi-fujita-rc/chat_app/main/docs/report/verification-report.html)　｜　[エグゼクティブサマリーを見る](https://htmlpreview.github.io/?https://raw.githubusercontent.com/takumi-fujita-rc/chat_app/main/docs/report/summary-report.html)

## 機能

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
| テスト | Playwright (E2E) |
| Node.js | v20 以上推奨 |

## ディレクトリ構成

```
chat_app/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts   # OpenAI API Route (Server)
│   │   ├── page.tsx            # チャット画面 (Client Component)
│   │   └── layout.tsx          # ルートレイアウト
│   ├── components/
│   │   ├── ChatInput.tsx       # 入力フォーム
│   │   ├── ChatMessage.tsx     # メッセージバブル
│   │   └── LoadingIndicator.tsx
│   ├── types/
│   │   └── chat.ts             # 型定義
│   └── lib/                    # 共通ユーティリティ
├── tests/
│   └── e2e/chat.pw.ts          # Playwright E2E テスト
├── docs/
│   ├── requirements/           # 要件定義書
│   ├── diagrams/               # シーケンス・アーキテクチャ図
│   ├── test-designs/           # テスト設計書
│   └── report/                 # 検証レポート
├── playwright.chat.config.ts   # Playwright 設定
└── .env.local                  # 環境変数（git 管理外）
```

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/<your-org>/chat_app.git
cd chat_app
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env.local` を作成し、OpenAI API キーを設定します。

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

> OpenAI API キーは [platform.openai.com](https://platform.openai.com/api-keys) で取得できます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm run type-check` | TypeScript 型チェック |

## テスト

### E2E テスト（Playwright）

事前に開発サーバーを起動した状態で実行してください。

```bash
# ヘッドレスで実行
npx playwright test --config=playwright.chat.config.ts

# ブラウザを表示しながら実行（slowMo: 800ms）
npx playwright test --config=playwright.chat.config.ts --headed
```

#### テストケース一覧

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
