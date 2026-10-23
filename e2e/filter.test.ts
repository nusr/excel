import { MAIN_CANVAS, test, expect } from './util';
import type { Page } from '@playwright/test';

async function selectCell(page: Page, reference: string) {
  const input = page.getByTestId('formula-bar-name-input');
  await input.fill(reference);
  await input.press('Enter');
}

async function prepareFilter(page: Page) {
  await page.getByTestId('menubar-excel-trigger').click();
  await page.getByTestId('menubar-import-input').setInputFiles({
    name: 'filter-data.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Name,Score\nAlpha,10\nBeta,20\nAlpha,30\nGamma,40'),
  });
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('Name');
  await selectCell(page, 'A1:B5');
  await page.getByTestId('toolbar-filter').click();
}

test('filter searches values and skips filtered-out rows', async ({ page }, testInfo) => {
  await prepareFilter(page);
  await page.getByTestId(MAIN_CANVAS).click({ position: { x: 106, y: 36 } });
  const panel = page.getByTestId('filter-modal');
  await expect(panel).toBeVisible();
  await page.getByRole('textbox', { name: 'Search values' }).fill('alp');
  await expect(page.getByRole('checkbox', { name: 'Alpha' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Beta' })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('filter-values.png') });
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await selectCell(page, 'A2');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A4');
});

for (const width of [1280, 390]) {
  test(`numeric filter remains usable at ${width}px`, async ({ page }, testInfo) => {
    await prepareFilter(page);
    await page.setViewportSize({ width, height: 800 });
    await page.getByTestId(MAIN_CANVAS).click({ position: { x: 182, y: 36 } });
    const panel = page.getByTestId('filter-modal');
    await expect(panel).toBeVisible();
    await page.getByTestId('filter-mode').getByRole('button').click();
    await page.getByRole('option', { name: 'Number filters', exact: true }).click();
    await page.getByTestId('filter-operator-0').getByRole('button').click();
    await page.getByRole('option', { name: 'Between', exact: true }).click();
    await page.getByRole('textbox', { name: 'Value 1', exact: true }).fill('15');
    await page.getByRole('textbox', { name: 'Upper bound', exact: true }).fill('30');
    await expect(page.getByRole('listbox', { includeHidden: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toBeEnabled();
    const rect = await panel.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
    expect(rect!.y + rect!.height).toBeLessThanOrEqual(800);
    await page.screenshot({ path: testInfo.outputPath(`filter-number-${width}.png`) });
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await selectCell(page, 'A1');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A3');
  });
}
