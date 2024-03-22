import { test, expect } from '@playwright/test';
import { INDEX_PAGE } from './a';

test.describe('toolbar.test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(INDEX_PAGE);
  });
  for (const item of ['bold', 'italic', 'wrap-text']) {
    test(`test toolbar ${item}`, async ({ page }) => {
      const dom = page.getByTestId(`toolbar-${item}`);
      await dom.click();

      await expect(dom).toHaveClass(/active/);
    });
  }
});
