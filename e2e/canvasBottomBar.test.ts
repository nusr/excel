import { INDEX_PAGE } from './a';
import { test, expect } from '@playwright/test';

test.describe('canvasBottomBar.test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(INDEX_PAGE);
  });

  test('test menubar not exist', async ({ page }) => {
    await expect(page.getByTestId('canvas-bottom-bar')).toBeHidden();
  });

  // test('test menubar exist', async ({ page }) => {
  //   await page.keyboard.down('Control');
  //   await page.keyboard.down('Meta');
  //   await page.keyboard.press('ArrowDown');
  //   const dom = page.getByTestId('canvas-bottom-bar');
  //   await expect(dom).toBeVisible();
  // });
});
