import { test, expect } from '@playwright/test';
import { sleep } from './util';

test('merge cells button is clickable', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data
  await page.keyboard.type('Merge Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Click merge cells button
  const mergeButton = page.getByTestId('toolbar-merge-cell');
  await expect(mergeButton).toBeVisible();
  await mergeButton.click();
  await sleep(50);

  // Verify cell still has content
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Merge Test',
  );
});

test('merge cell select dropdown exists', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Check if merge cell select exists
  const mergeSelect = page.getByTestId('toolbar-merge-cell-select');
  await expect(mergeSelect).toBeVisible();
});

test('unmerge cells', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data
  await page.keyboard.type('Merged Cell');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Merge cells
  await page.getByTestId('toolbar-merge-cell').click();
  await sleep(50);

  // Unmerge by clicking again
  await page.getByTestId('toolbar-merge-cell').click();
  await sleep(50);

  // Verify content is still there
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Merged Cell',
  );
});
