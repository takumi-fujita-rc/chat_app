import { test, expect } from '@playwright/test';

test.describe('認証 E2E', () => {

  test('AUTH-001: 未認証アクセス — ログイン画面にリダイレクト', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'AIチャット' })).toBeVisible();
  });

  test('AUTH-002: ログイン失敗 — エラーメッセージ表示', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@example.com').fill('wrong@example.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible({ timeout: 8000 });
  });

  test('AUTH-003: ログイン成功 — チャット画面に遷移', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('admin1234');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
    await expect(page.getByText('AIとの会話を始めましょう')).toBeVisible();
  });

  test('AUTH-004: ログアウト — ログイン画面に戻る', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.getByPlaceholder('admin@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('admin1234');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // ログアウト
    await page.getByRole('button', { name: 'ログアウト' }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test('AUTH-005: 認証済みユーザーが /login にアクセス — チャット画面にリダイレクト', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.getByPlaceholder('admin@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('admin1234');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // 再度 /login にアクセスしてもチャット画面に留まる
    await page.goto('/login');
    await expect(page).toHaveURL('/', { timeout: 8000 });
  });

});
