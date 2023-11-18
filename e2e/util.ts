import * as puppeteer from 'puppeteer';

declare global {
  // eslint-disable-next-line no-var
  var __browserPage: puppeteer.Page;
}

async function setupPuppeteer() {
  const browser = await puppeteer.launch({
    headless: 'new',
    waitForInitialPage: true,
    defaultViewport: {
      width: 1600,
      height: 800,
    },
  });
  __browserPage = await browser.newPage();
}

export function sleep(milliseconds: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function openPage(): Promise<void> {
  await setupPuppeteer();
  const port = 8000;
  const filePath = `https://localhost:${port}`;
  console.log(filePath);
  await __browserPage.goto(filePath);
  await sleep(1000);
}

export function getTestIdSelector(testId: string): string {
  return `[data-testid="${testId}"]`;
}
