import { test, expect } from '@playwright/test';
import { sleep } from './util';

test('apply bold formatting', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Bold Text');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply bold
  await page.getByTestId('toolbar-bold').click();
  await sleep(50);

  // Verify cell is selected and has content
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Bold Text',
  );
});

test('apply italic formatting', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Italic Text');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply italic
  await page.getByTestId('toolbar-italic').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Italic Text',
  );
});

test('apply strike formatting', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Strike Text');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply strike
  await page.getByTestId('toolbar-strike').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Strike Text',
  );
});

test('change font size', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Font Size Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Click font size dropdown
  await page.getByTestId('toolbar-font-size').click();
  await sleep(100);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
});

test('toggle wrap text', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('This is a long text that should wrap');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Toggle wrap text
  await page.getByTestId('toolbar-wrap-text').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'This is a long text that should wrap',
  );
});

test('apply horizontal center alignment', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Centered');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply center alignment
  await page.getByTestId('toolbar-horizontal-center').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
});

test('apply horizontal right alignment', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Right Aligned');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply right alignment
  await page.getByTestId('toolbar-horizontal-right').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
});

test('apply vertical top alignment', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Top Aligned');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply vertical top alignment
  await page.getByTestId('toolbar-vertical-top').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
});

test('apply vertical middle alignment', async ({ page }) => {
  await page.keyboard.press('Escape');
  await page.keyboard.type('Middle Aligned');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Apply vertical middle alignment
  await page.getByTestId('toolbar-vertical-middle').click();
  await sleep(50);

  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
});
