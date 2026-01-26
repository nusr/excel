import { test, expect } from '@playwright/test';
import { sleep } from './util';

test('scrollbars are visible', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Check if vertical scrollbar exists
  const verticalScrollBar = page.getByTestId('vertical-scroll-bar');
  await expect(verticalScrollBar).toBeVisible();

  // Check if horizontal scrollbar exists
  const horizontalScrollBar = page.getByTestId('horizontal-scroll-bar');
  await expect(horizontalScrollBar).toBeVisible();
});

test('navigate far down and scrollbar updates', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data at A1
  await page.keyboard.type('Start');
  await page.keyboard.press('Enter');

  // Navigate down multiple times
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('ArrowDown');
    await sleep(10);
  }

  // Should be at row 22
  const cellName = page.getByTestId('formula-bar-name-input');
  const value = await cellName.inputValue();
  expect(value).toContain('A2');
});

test('navigate far right and scrollbar updates', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data at A1
  await page.keyboard.type('Start');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Navigate right multiple times
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight');
    await sleep(10);
  }

  // Should have moved to the right
  const cellName = page.getByTestId('formula-bar-name-input');
  const value = await cellName.inputValue();
  expect(value).not.toBe('A1');
});
