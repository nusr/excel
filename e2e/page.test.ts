import { test, expect } from '@playwright/test';
import { goto, MAIN_CANVAS } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Excel/);
});

test.skip('screen shot', async ({ page }) => {
  await expect(page.getByTestId(MAIN_CANVAS)).toHaveScreenshot(
    'screenshot.png',
  );
});
