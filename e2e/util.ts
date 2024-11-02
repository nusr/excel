import { Page } from '@playwright/test';

export const INDEX_PAGE = '/';

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
  await page.waitForSelector('[data-testid="canvas-main"]');
}

export async function clickFirstCell(page: Page) {
  await page.getByTestId('canvas-main').click({
    position: {
      x: 40,
      y: 40,
    },
  });
}
