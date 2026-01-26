import { test, expect } from '@playwright/test';
import { clickFirstCell, sleep } from './util';
import './util';

function skipTest(browserName: string) {
  test.skip(
    browserName === 'firefox',
    'Skip test on Firefox',
  );
}

test.describe('undo and redo', () => {
  test('undo and redo basic operations', async ({ page, browserName }) => {
    skipTest(browserName);

    await page.keyboard.press('Escape');
    await sleep(100);

    // Input two values
    await page.keyboard.type('123');
    await page.keyboard.press('Enter');
    await sleep(200);

    await page.keyboard.type('456');
    await page.keyboard.press('Enter');
    await sleep(200);

    // Undo both
    await page.getByTestId('toolbar-undo').click();
    await sleep(200);
    await page.getByTestId('toolbar-undo').click();
    await sleep(200);

    // Verify both cells are empty
    await clickFirstCell(page);
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');

    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');

    // Redo first value
    await page.getByTestId('toolbar-redo').click();
    await sleep(200);

    await clickFirstCell(page);
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('123');

    // Redo second value
    await page.getByTestId('toolbar-redo').click();
    await sleep(200);

    await clickFirstCell(page);
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('456');
  });

  test('undo multiple operations', async ({ page, browserName }) => {
    skipTest(browserName);
    await page.keyboard.press('Escape');

    await page.keyboard.type('First');
    await page.keyboard.press('Enter');
    await sleep(100);

    await page.keyboard.type('Second');
    await page.keyboard.press('Enter');
    await sleep(100);

    await page.keyboard.type('Third');
    await page.keyboard.press('Enter');
    await sleep(200);

    await page.getByTestId('toolbar-undo').click();
    await sleep(200);

    await clickFirstCell(page);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A3');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');

    await page.getByTestId('toolbar-undo').click();
    await sleep(200);

    await clickFirstCell(page);
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');

    await page.getByTestId('toolbar-undo').click();
    await sleep(200);

    await clickFirstCell(page);
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');
  });

  test('redo multiple operations', async ({ page, browserName }) => {
    skipTest(browserName);
    await page.keyboard.press('Escape');
    await sleep(100);

    await page.keyboard.type('111');
    await page.keyboard.press('Enter');
    await sleep(100);
    await page.keyboard.type('222');
    await page.keyboard.press('Enter');
    await sleep(100);
    await page.keyboard.type('333');
    await page.keyboard.press('Enter');
    await sleep(200);

    await page.getByTestId('toolbar-undo').click();
    await sleep(200);
    await page.getByTestId('toolbar-undo').click();
    await sleep(200);
    await page.getByTestId('toolbar-undo').click();
    await sleep(200);

    await page.getByTestId('toolbar-redo').click();
    await sleep(200);
    await clickFirstCell(page);
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('111');

    await page.getByTestId('toolbar-redo').click();
    await sleep(200);
    await clickFirstCell(page);
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('222');

    await page.getByTestId('toolbar-redo').click();
    await sleep(200);
    await clickFirstCell(page);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A3');
    await expect(page.getByTestId('formula-editor-trigger')).toHaveText('333');
  });

  test('toolbar buttons disabled state', async ({ page }) => {
    await expect(page.getByTestId('toolbar-undo')).toBeDisabled();
    await expect(page.getByTestId('toolbar-redo')).toBeDisabled();

    await page.keyboard.press('Escape');

    // Input first value
    await page.keyboard.type('Test1');
    await page.keyboard.press('Enter');
    await sleep(200);

    // Input second value to ensure undo manager has operations
    await page.keyboard.type('Test2');
    await page.keyboard.press('Enter');
    await sleep(200);

    await expect(page.getByTestId('toolbar-undo')).not.toBeDisabled();
    await expect(page.getByTestId('toolbar-redo')).toBeDisabled();

    await page.getByTestId('toolbar-undo').click();
    await sleep(200);

    await expect(page.getByTestId('toolbar-undo')).not.toBeDisabled();
    await expect(page.getByTestId('toolbar-redo')).not.toBeDisabled();
  });
});
