import { Page } from '@playwright/test';

export const INDEX_PAGE = '/app';
export const MAIN_CANVAS = 'canvas-main';

export function getByTestId(selector: string) {
  return `[data-testid="${selector}"]`;
}

export async function goto(page: Page, url = INDEX_PAGE) {
  page.on('pageerror', (err) => {
    throw err;
  });

  page.on('console', (msg) => {
    if (process.env.E2E_TEST) {
      return;
    }
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      throw new Error(text);
    }
  });

  await page.goto(url);
  if (url === INDEX_PAGE) {
    await page.waitForSelector(getByTestId(MAIN_CANVAS));
  }
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
