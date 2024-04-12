import { INDEX_PAGE } from './a';
import { test, expect } from '@playwright/test';

test.describe('menubar.test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(INDEX_PAGE);
  });

  test('test menubar exist', async ({ page }) => {
    await expect(page.getByTestId('menubar')).toBeVisible();
  });

  test(`test menubar click`, async ({ page }) => {
    await page.getByTestId('menubar-excel').click();

    await expect(page.getByTestId('menubar-import-xlsx')).toBeVisible();
    await expect(page.getByTestId('menubar-import-csv')).toBeVisible();
    await expect(page.getByTestId('menubar-export-xlsx')).toBeVisible();
    await expect(page.getByTestId('menubar-export-csv')).toBeVisible();
  });

});
