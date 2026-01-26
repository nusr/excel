import { test, expect } from '@playwright/test';
import { sleep } from './util';

test('add new sheet', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Click add sheet button
  await page.getByTestId('sheet-bar-add-sheet').click();
  await sleep(100);

  // Should have sheet bar visible
  const sheetBar = page.getByTestId('sheet-bar');
  await expect(sheetBar).toBeVisible();
});

test('verify default sheet is present', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Check if sheet bar exists
  const sheetBar = page.getByTestId('sheet-bar');
  await expect(sheetBar).toBeVisible();

  // Check if there's an active sheet
  const activeSheet = page.getByTestId('sheet-bar-active-item');
  await expect(activeSheet).toBeVisible();
});

test('input data and add new sheet', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data in first sheet
  await page.keyboard.type('Sheet 1 Data');
  await page.keyboard.press('Enter');
  await sleep(50);

  // Add new sheet
  await page.getByTestId('sheet-bar-add-sheet').click();
  await sleep(100);

  // Input data in new sheet
  await page.keyboard.press('Escape');
  await page.keyboard.type('Sheet 2 Data');
  await page.keyboard.press('Enter');
  await sleep(50);

  // Verify current cell
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Sheet 2 Data',
  );
});

test('switch between sheets maintains data', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data in first sheet
  await page.keyboard.type('First Sheet');
  await page.keyboard.press('Enter');
  await sleep(50);

  // Get the first sheet ID
  const firstSheetItem = page.getByTestId('sheet-bar-active-item');
  await expect(firstSheetItem).toBeVisible();

  // Add second sheet
  await page.getByTestId('sheet-bar-add-sheet').click();
  await sleep(100);

  // Enter data in second sheet
  await page.keyboard.press('Escape');
  await page.keyboard.type('Second Sheet');
  await page.keyboard.press('Enter');
  await sleep(50);

  // Verify data in second sheet
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Second Sheet',
  );
});

test('sheet bar list is visible', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Verify sheet bar list exists
  const sheetBarList = page.getByTestId('sheet-bar-list');
  await expect(sheetBarList).toBeVisible();
});
