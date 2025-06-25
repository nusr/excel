import { test, expect } from '@playwright/test';
import { goto, COLLABORATION_PAGE } from './util';

test.beforeEach(async ({ page }) => {
  await goto(page, COLLABORATION_PAGE);
});

test('has title', async ({ page }) => {
  await expect(
    page.getByText('Excel Collaborative Example (see iframes below)'),
  ).toBeVisible();
});

test('input', async ({ page }) => {
  const iframe = page.frameLocator('#left');

  await iframe.getByTestId('formula-editor-trigger').click();

  const inputElement = iframe.getByTestId('formula-editor');

  await inputElement.fill('hello world');

  const inputValue = await inputElement.inputValue();
  expect(inputValue).toBe('hello world');
});
