import { test, expect } from '@playwright/test';
import { gotoHomePage } from './util';

test('Page load time should be less then 4000 ms', async ({ page }) => {
  const startTime = Date.now();
  await gotoHomePage(page);
  const loadTime = Date.now() - startTime;
  console.log(`page load time: ${loadTime} ms`);
  expect(loadTime).toBeLessThan(4000);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Excel/);
});
