import { test, expect } from '@playwright/test';
import { goto } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('input text', async ({ page }) => {
  await page.keyboard.press('Escape');

  await page.keyboard.type('Hello World');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Hello World',
  );
});

