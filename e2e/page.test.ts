import { test, expect } from '@playwright/test';
import { goto } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('has title', async ({ page }) => {
  await expect(page).toHaveTitle(/Excel/);
});
