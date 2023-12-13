import * as puppeteer from 'puppeteer';
import fs from 'fs';

declare global {
  // eslint-disable-next-line no-var
  var __browserPage: puppeteer.Page;
  const __portFilePath: string;
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
  const check = fs.existsSync(__portFilePath);
  let port = 8000;
  if (check) {
    const portData = fs.readFileSync(__portFilePath, 'utf-8');
    const t = parseInt(portData, 10);
    if (!isNaN(t)) {
      port = t;
    }
    fs.unlinkSync(__portFilePath);
  }

  const filePath = `http://localhost:${port}`;
  console.log(filePath);
  await setupPuppeteer();
  await __browserPage.goto(filePath);
  await sleep(1000);
}

export function getTestIdSelector(testId: string): string {
  return `[data-testid="${testId}"]`;
}
