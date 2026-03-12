import { test, expect } from '@playwright/test';

test.describe('chat_app E2E', () => {

  test('E2E-001: 初期表示 — 空の状態が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('AIとの会話を始めましょう')).toBeVisible();
    await expect(page.getByRole('button', { name: '会話をリセット' })).toBeDisabled();
  });

  test('E2E-002: メッセージ送信 — ユーザーメッセージが表示される', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox').fill('こんにちは');
    await page.getByRole('button', { name: '送信' }).click();

    // ユーザーメッセージ表示確認（右側の青いバブル）
    await expect(page.getByText('こんにちは', { exact: true })).toBeVisible();

    // 送信後は入力欄が空になる
    await expect(page.getByRole('textbox')).toHaveValue('');
  });

  test('E2E-003: AIレスポンス受信 — AIの返答が表示される', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox').fill('「テスト」と一言だけ返してください');
    await page.getByRole('button', { name: '送信' }).click();

    // AIレスポンス受信（最大20秒待機）
    await expect(page.locator('[class*="rounded-bl-sm"]').first()).toBeVisible({ timeout: 20000 });

    // ローディング消去確認
    await expect(page.locator('.animate-bounce').first()).not.toBeVisible({ timeout: 5000 });

    // リセットボタンが有効化
    await expect(page.getByRole('button', { name: '会話をリセット' })).toBeEnabled();
  });

  test('E2E-004: Enterキー送信', async ({ page }) => {
    await page.goto('/');
    const textarea = page.getByRole('textbox');
    await textarea.fill('Enterで送信');
    await textarea.press('Enter');
    await expect(page.getByText('Enterで送信')).toBeVisible();
  });

  test('E2E-005: Shift+Enterで改行（送信されない）', async ({ page }) => {
    await page.goto('/');
    const textarea = page.getByRole('textbox');
    await textarea.fill('1行目');
    await textarea.press('Shift+Enter');
    await textarea.type('2行目');
    // 送信されていないことを確認
    await expect(page.getByText('AIとの会話を始めましょう')).toBeVisible();
    await expect(textarea).toContainText('1行目');
  });

  test('E2E-006: 会話リセット', async ({ page }) => {
    await page.goto('/');

    // メッセージ送信
    await page.getByRole('textbox').fill('リセットテスト');
    await page.getByRole('button', { name: '送信' }).click();
    await expect(page.getByText('リセットテスト')).toBeVisible();

    // AIレスポンス待機
    await expect(page.locator('[class*="rounded-bl-sm"]').first()).toBeVisible({ timeout: 20000 });

    // リセット実行
    await page.getByRole('button', { name: '会話をリセット' }).click();

    // メッセージが消えて空の状態に戻る
    await expect(page.getByText('AIとの会話を始めましょう')).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('button', { name: '会話をリセット' })).toBeDisabled();
  });

  test('E2E-007: レスポンシブ — モバイル表示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('textbox')).toBeVisible();
    await expect(page.getByRole('button', { name: '送信' })).toBeVisible();
    await expect(page.getByText('AIとの会話を始めましょう')).toBeVisible();
  });

  test('E2E-008: 空文字送信 — 送信されない', async ({ page }) => {
    await page.goto('/');
    const sendBtn = page.getByRole('button', { name: '送信' });
    await expect(sendBtn).toBeDisabled();
    // 空白のみ
    await page.getByRole('textbox').fill('   ');
    await expect(sendBtn).toBeDisabled();
  });

});
