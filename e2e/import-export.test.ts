import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test, expect, type Page } from '@playwright/test';
import { gotoHomePage } from './util';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => performance.setResourceTimingBufferSize(2000));
  await gotoHomePage(page);
});

async function excelizeRequests(page: Page) {
  return page.evaluate(() => performance.getEntriesByType('resource')
    .map((entry) => new URL(entry.name))
    .filter((url) => !url.searchParams.has('url'))
    .filter((url) => url.pathname.includes('excelize.wasm') ||
      /\/main(?:-[^/]+)?\.js$/.test(url.pathname))
    .map((url) => url.href));
}

test('CSV and JSON operations do not load Excelize', async ({ page }) => {
  expect(await excelizeRequests(page)).toEqual([]);
  await page.getByTestId('menubar-excel-trigger').click();
  await page.getByTestId('menubar-import-input').setInputFiles({
    name: 'data.csv', mimeType: 'text/csv', buffer: Buffer.from('hello,42'),
  });
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('hello');
  await page.keyboard.press('Escape');

  for (const ext of ['csv', 'json']) {
    await page.getByTestId('menubar-excel-trigger').click();
    await page.getByRole('menuitem', { name: /export/i }).hover();
    const download = page.waitForEvent('download');
    await page.getByTestId(ext === 'json' ? 'menubar-export-json' : 'menubar-export-more-csv').click();
    expect((await download).suggestedFilename()).toMatch(new RegExp(`\\.${ext}$`));
  }
  expect(await excelizeRequests(page)).toEqual([]);
});

for (const transport of ['http-gzip', 'raw-gzip']) {
  test(`Excel import/export loads the runtime and WASM once (${transport})`, async ({ page }) => {
    if (transport === 'raw-gzip') {
      await page.route('**/*excelize.wasm*', async (route) => {
        if (route.request().resourceType() !== 'fetch') return route.continue();
        await route.fulfill({
          contentType: 'application/gzip',
          body: await readFile(require.resolve('excelize-wasm/excelize.wasm.gz')),
        });
      });
    }
    expect(await excelizeRequests(page)).toEqual([]);
    await page.getByTestId('menubar-excel-trigger').click();
    await page.getByTestId('menubar-import-input').setInputFiles(
      path.resolve('scripts/origin.xlsx'),
    );
    await expect.poll(() => page.getByTestId('sheet-bar-list')
      .evaluate((element) => element.children.length)).toBeGreaterThanOrEqual(5);
    const loaded = await excelizeRequests(page);
    expect(loaded.filter((url) => url.includes('excelize.wasm'))).toHaveLength(1);
    expect(loaded.filter((url) => /\/main(?:-[^/]+)?\.js/.test(url))).toHaveLength(1);
    await page.keyboard.press('Escape');
    await page.getByTestId('menubar-excel-trigger').click();
    await page.getByRole('menuitem', { name: /export/i }).hover();
    const pending = page.waitForEvent('download');
    await page.getByTestId('menubar-export-more-xlsx').click();
    const download = await pending;
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
    const file = await download.path();
    if (!file) throw new Error('XLSX download did not produce a file');
    expect((await readFile(file)).subarray(0, 2).toString()).toBe('PK');
    expect(await excelizeRequests(page)).toEqual(loaded);
  });
}

test('invalid workbook import notifies the user and allows retry', async ({ page }) => {
  await page.getByTestId('menubar-excel-trigger').click();
  const input = page.getByTestId('menubar-import-input');
  await input.setInputFiles({
    name: 'broken.xlsx', mimeType: 'application/octet-stream', buffer: Buffer.from('not a workbook'),
  });
  await expect(page.getByRole('alertdialog')).toContainText('Import failed:');
  await expect(input).toHaveValue('');
  await input.setInputFiles(path.resolve('scripts/origin.xlsx'));
  await expect.poll(() => page.getByTestId('sheet-bar-list')
    .evaluate((element) => element.children.length)).toBeGreaterThanOrEqual(5);
  expect((await excelizeRequests(page)).filter((url) => url.includes('excelize.wasm'))).toHaveLength(1);
});
