import { test, expect } from '@playwright/test';
import { sleep, MAIN_CANVAS } from './util';

test('open context menu with right click', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter some data
  await page.keyboard.type('Test Data');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await sleep(100);

  // Right click to open context menu
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 40, y: 40 },
  });
  await sleep(200);

  // Check if context menu appears
  const contextMenu = page.getByTestId('context-menu');
  await expect(contextMenu).toBeVisible();
});

test('context menu copy option', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data
  await page.keyboard.type('Copy Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Right click to open context menu
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 40, y: 40 },
  });
  await sleep(100);

  // Click copy in context menu
  const copyButton = page.getByTestId('context-menu-copy');
  await expect(copyButton).toBeVisible();
  await copyButton.click();
  await sleep(50);

  // Move to next cell and paste
  await page.keyboard.press('ArrowDown');
  await page.getByTestId('toolbar-paste').click();
  await sleep(50);

  // Verify paste worked
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Copy Test',
  );
});

test('context menu cut option', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data
  await page.keyboard.type('Cut Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');

  // Right click to open context menu
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 40, y: 40 },
  });
  await sleep(100);

  // Click cut in context menu
  const cutButton = page.getByTestId('context-menu-cut');
  await expect(cutButton).toBeVisible();
  await cutButton.click();
  await sleep(50);

  // Move to next cell and paste
  await page.keyboard.press('ArrowDown');
  await page.getByTestId('toolbar-paste').click();
  await sleep(50);

  // Verify paste worked
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A2');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Cut Test',
  );

  // Verify original cell is empty
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('formula-bar-name-input')).toHaveValue('A1');
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText('');
});

test('context menu paste option', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter data and copy
  await page.keyboard.type('Paste Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await page.getByTestId('toolbar-copy').click();
  await sleep(100);

  // Move to another cell
  await page.keyboard.press('ArrowDown');
  await sleep(50);

  // Right click to open context menu (using middle position to avoid UI elements)
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 100, y: 50 },
  });
  await sleep(200);

  // Click paste in context menu
  const pasteButton = page.getByTestId('context-menu-paste');
  await expect(pasteButton).toBeVisible();
  await pasteButton.click();
  await sleep(50);

  // Verify paste worked
  await expect(page.getByTestId('formula-editor-trigger')).toHaveText(
    'Paste Test',
  );
});

test('context menu has insert row options', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter some data to stabilize the canvas
  await page.keyboard.type('Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await sleep(100);

  // Right click to open context menu
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 40, y: 40 },
  });
  await sleep(200);

  // Check if context menu appears first
  const contextMenu = page.getByTestId('context-menu');
  await expect(contextMenu).toBeVisible();

  // Check if insert row options exist
  const insertRowAbove = page.getByTestId('context-menu-insert-row-above');
  const insertRowBelow = page.getByTestId('context-menu-insert-row-below');

  await expect(insertRowAbove).toBeVisible();
  await expect(insertRowBelow).toBeVisible();
});

test('context menu has insert column options', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter some data to stabilize the canvas
  await page.keyboard.type('Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await sleep(100);

  // Right click to open context menu
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 40, y: 40 },
  });
  await sleep(200);

  // Check if insert column options exist
  const insertColumnLeft = page.getByTestId('context-menu-insert-column-left');
  const insertColumnRight = page.getByTestId(
    'context-menu-insert-column-right',
  );

  await expect(insertColumnLeft).toBeVisible();
  await expect(insertColumnRight).toBeVisible();
});

test('context menu has delete options', async ({ page }) => {
  await page.keyboard.press('Escape');

  // Enter some data to stabilize the canvas
  await page.keyboard.type('Test');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowUp');
  await sleep(100);

  // Right click on the triangle (top-left corner) to open context menu
  await page.getByTestId(MAIN_CANVAS).click({
    button: 'right',
    position: { x: 10, y: 10 },
  });
  await sleep(200);

  // Check if delete option exists
  const deleteButton = page.getByTestId('context-menu-delete');
  await expect(deleteButton).toBeVisible();
});
