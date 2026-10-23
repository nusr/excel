import { test, expect } from './util';

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
  const cellName = page.getByTestId('formula-bar-name-input');
  await expect(cellName).toHaveValue('A2');

  for (let row = 3; row <= 62; row++) {
    await page.keyboard.press('ArrowDown');
    await expect(cellName).toHaveValue(`A${row}`);
  }

  const scrollThumb = page.getByTestId('vertical-scroll-bar-content');
  await expect
    .poll(() =>
      scrollThumb.evaluate(
        (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
      ),
    )
    .toBeGreaterThan(0);
});

test('navigate far right and scrollbar updates', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data at A1
  await page.keyboard.type('Start');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  const cellName = page.getByTestId('formula-bar-name-input');
  await expect(cellName).toHaveValue('A1');

  for (const column of 'BCDEFGHIJKLMNOPQRSTU') {
    await page.keyboard.press('ArrowRight');
    await expect(cellName).toHaveValue(`${column}1`);
  }

  const scrollThumb = page.getByTestId('horizontal-scroll-bar-content');
  await expect
    .poll(() =>
      scrollThumb.evaluate(
        (element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41,
      ),
    )
    .toBeGreaterThan(0);
});
