import { test, expect } from '@playwright/test';
import { goto, sleep } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('copy and paste value', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('hello');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await page.getByTestId('toolbar-copy').click();
  await page.keyboard.press('Enter');
  await page.getByTestId('toolbar-paste').click();
  await sleep(50)
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('hello');
});

test('cut and paste value', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('hello');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await page.getByTestId('toolbar-cut').click();
  await page.keyboard.press('Enter');
  await page.getByTestId('toolbar-paste').click();
  await sleep(50)
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('hello');
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');
});
