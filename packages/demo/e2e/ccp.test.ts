import { test, expect } from '@playwright/test';
import { goto, sleep } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('copy and paste value', async ({ page }) => {
  await page.keyboard.down('Delete');
  await page.keyboard.down('Delete');
  await page.keyboard.type('hello');
  await page.keyboard.down('Enter');
  await page.keyboard.down('ArrowUp');
  await page.getByTestId('toolbar-copy').click();
  await page.keyboard.down('Enter');
  await page.getByTestId('toolbar-paste').click();
  await sleep(500);
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('hello');
});

test('cut and paste value', async ({ page }) => {
  await page.keyboard.down('Delete');
  await page.keyboard.down('Delete');
  await page.keyboard.type('hello');
  await page.keyboard.down('Enter');
  await page.keyboard.down('ArrowUp');
  await page.getByTestId('toolbar-cut').click();
  await page.keyboard.down('Enter');
  await page.getByTestId('toolbar-paste').click();
  await sleep(500);
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('hello');
  await page.keyboard.down('ArrowUp');
  await sleep(500);
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');
});
