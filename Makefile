.PHONY: test test-auth test-chat test-all dev build help

# デフォルト: 全E2Eテスト実行
test: test-all

## 全E2Eテスト（認証 + チャット）
test-all:
	@echo "▶ Running all E2E tests..."
	npx playwright test --config=playwright.auth.config.ts
	npx playwright test --config=playwright.chat.config.ts
	@echo "✅ All E2E tests passed."

## 認証テストのみ (AUTH-001〜005)
test-auth:
	npx playwright test --config=playwright.auth.config.ts

## チャットテストのみ (E2E-001〜008)
test-chat:
	npx playwright test --config=playwright.chat.config.ts

## ブラウザを表示してテスト実行（視覚確認用）
test-headed:
	npx playwright test --config=playwright.auth.config.ts --headed
	npx playwright test --config=playwright.chat.config.ts --headed

## 開発サーバー起動
dev:
	npm run dev

## プロダクションビルド
build:
	npm run build

## ヘルプ
help:
	@echo ""
	@echo "使用可能なコマンド:"
	@echo "  make test          全E2Eテスト実行（認証 + チャット）"
	@echo "  make test-auth     認証テストのみ実行"
	@echo "  make test-chat     チャットテストのみ実行"
	@echo "  make test-headed   ブラウザ表示でテスト実行"
	@echo "  make dev           開発サーバー起動"
	@echo "  make build         プロダクションビルド"
	@echo ""
