import { Page } from '@playwright/test';

export const INDEX_PAGE = '/app';
export const MAIN_CANVAS = 'canvas-main';

export function getByTestId(selector: string) {
  return `[data-testid="${selector}"]`;
}

export async function goto(page: Page) {
  page.on('pageerror', (err) => {
    throw err;
  });

  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      throw new Error(msg.text());
    }
  });

  await page.goto(INDEX_PAGE);
  await page.waitForSelector(getByTestId(MAIN_CANVAS));
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
