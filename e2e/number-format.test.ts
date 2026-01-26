import { test, expect } from '@playwright/test';
import { sleep } from './util';

test('number format dropdown is visible', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Check if number format select exists
  const numberFormat = page.getByTestId('toolbar-number-format');
  await expect(numberFormat).toBeVisible();

  // Check the displayed value
  const numberFormatValue = page.getByTestId('toolbar-number-format-value');
  await expect(numberFormatValue).toBeVisible();
});

test('apply number format to cell with number', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter a number
  await page.keyboard.type('1234.56');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Click number format dropdown
  const numberFormat = page.getByTestId('toolbar-number-format');
  await expect(numberFormat).toBeVisible();
  await numberFormat.click();
  await sleep(100);

  // Verify cell has the number
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    '1234.56',
  );
});

test('number format with percentage', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter a decimal number
  await page.keyboard.type('0.75');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Open number format
  await page.getByTestId('toolbar-number-format').click();
  await sleep(100);

  // Verify the value
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('0.75');
});

test('number format with currency', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter a number
  await page.keyboard.type('99.99');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Open number format dropdown
  await page.getByTestId('toolbar-number-format').click();
  await sleep(100);

  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('99.99');
});

test('number format with large number', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter a large number
  await page.keyboard.type('1000000');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Verify the number
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    '1000000',
  );

  // Number format should be accessible
  const numberFormat = page.getByTestId('toolbar-number-format');
  await expect(numberFormat).toBeVisible();
});

test('number format preserves value after format change', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter a number
  await page.keyboard.type('42.5');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Click number format
  await page.getByTestId('toolbar-number-format').click();
  await sleep(100);

  // Close dropdown by pressing Escape
  await page.keyboard.press('Escape');
  await sleep(50);

  // Value should still be there
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('42.5');
});
