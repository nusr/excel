import { test, expect } from '@playwright/test';
import { goto } from './util';

test('Page load time should be less then 3000 ms', async ({ page }) => {
  const startTime = Date.now();
  await goto(page);
  const loadTime = Date.now() - startTime;
  console.log(`page load time: ${loadTime} ms`);
  expect(loadTime).toBeLessThan(3000);
});
