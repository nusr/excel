import { Page, expect, test as base } from '@playwright/test';

const clearTable = async (page: Page) => {
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
};

export const MAIN_CANVAS = 'canvas-main';

const baseURL = process.env.BASE_URL ?? '';

const isWhiteList = (text: string) => {
  const whiteList = ['due to access control checks', 'ingest.us.sentry.io'];
  return whiteList.some((item) => text.includes(item));
};

export async function gotoHomePage(page: Page) {
  page.on('pageerror', (err) => {
    if (isWhiteList(err.message)) {
      return;
    }
    throw err;
  });

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if ((type === 'error' || type === 'warning') && !isWhiteList(text)) {
      throw new Error(text);
    }
  });

  page.on('requestfailed', (req) => {
    if (isWhiteList(req.url())) {
      return;
    }
    throw new Error(
      `Request failed: ${req.url()} - ${req.failure()?.errorText}`,
    );
  });

  page.on('response', (res) => {
    if (!res.ok() && res.status() >= 400) {
      throw new Error(`Response failed: ${res.url()} - ${res.status()}`);
    }
  });

  if (!baseURL) {
    throw new Error('process.env.BASE_URL is not defined');
  }

  await page.goto(baseURL);

  await clearTable(page);

  await expect(page.getByTestId(MAIN_CANVAS)).toBeVisible({
    timeout: 10 * 1000,
  });
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
