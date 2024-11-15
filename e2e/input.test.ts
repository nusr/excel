import { test, expect } from '@playwright/test';
import { goto } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('input text', async ({ page }) => {
  await page.keyboard.down('Delete');
  await page.keyboard.down('Delete');

  await page.keyboard.type('Hello World');
  await page.keyboard.down('Enter');
  await page.keyboard.down('ArrowUp');
  
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Hello World',
  );
});

