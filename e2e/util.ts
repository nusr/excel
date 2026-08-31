import { Page, expect, test as base } from '@playwright/test';

const clearTable = async (page: Page) => {
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
};

// test.beforeEach(async ({ page }) => {
//   await gotoHomePage(page);
// });

// test.afterEach(async ({ page }) => {
//   await clearTable(page);
// });

export const MAIN_CANVAS = 'canvas-main';

export async function gotoHomePage(page: Page) {
  page.on('pageerror', (err) => {
    throw err;
  });

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      throw new Error(text);
    }
  });

  await page.goto('/');

  await clearTable(page);

  await expect(page.getByTestId(MAIN_CANVAS)).toBeVisible();
}

export async function clickFirstCell(page: Page, isDbClick = false) {
  const position = {
    x: 40,
    y: 40,
  };
  if (isDbClick) {
    await page.getByTestId(MAIN_CANVAS).dblclick({
      position,
    });
  } else {
    await page.getByTestId(MAIN_CANVAS).click({
      position,
    });
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await gotoHomePage(page);

    await use(page);

    await clearTable(page);
  },
});

export { expect };
