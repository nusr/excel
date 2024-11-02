import { test, expect } from '@playwright/test';
import { goto, clickFirstCell } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page);
});

test('copy and paste value', async ({ page }) => {
  await page.getByTestId('toolbar-copy').click();
  await clickFirstCell(page);
  await page.keyboard.down('Tab');
  await page.getByTestId('toolbar-paste').click();
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('B1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('1');
});


test('cut and paste value', async ({ page }) => {
  await page.getByTestId('toolbar-cut').click();
  await clickFirstCell(page);
  await page.keyboard.down('Tab');
  await page.getByTestId('toolbar-paste').click();
  await clickFirstCell(page);
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');
});