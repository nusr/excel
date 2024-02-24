import * as puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var browserPage: puppeteer.Page;
}

let port = 8000;

beforeAll(async () => {
  await setupPuppeteer();
  await sleep(1000);
  getPort();
});
afterAll(async () => {
  await browserPage.close();
});

async function setupPuppeteer() {
  const browser = await puppeteer.launch({
    headless: true,
    waitForInitialPage: true,
    defaultViewport: {
      width: 1600,
      height: 800,
    },
  });
  browserPage = await browser.newPage();
}

function getPort() {
  const filePath = path.join(process.cwd(), 'port.txt');
  const check = fs.existsSync(filePath);
  if (check) {
    const portData = fs.readFileSync(filePath, 'utf-8');
    const t = parseInt(portData, 10);
    if (!isNaN(t)) {
      port = t;
    }
    fs.unlinkSync(filePath);
  }
}

export function sleep(milliseconds: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function openPage(): Promise<void> {
  const filePath = `http://localhost:${port}`;
  await browserPage.goto(filePath);
  await sleep(500);
}

export function getTestIdSelector(testId: string): string {
  return `[data-testid="${testId}"]`;
}

export async function clickDom(selector: string): Promise<void> {
  await browserPage.click(getTestIdSelector(selector));
  await sleep(100);
}

async function isVisible(testId: string) {
  const isVisible = await browserPage.evaluate((selector: string) => {
    const element = document.querySelector(selector);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return element?.offsetParent !== null;
  }, getTestIdSelector(testId));
  return isVisible;
}

export async function checkExist(selector: string): Promise<void> {
  const check = await isVisible(selector);
  expect(check).toBeTruthy();
}

export async function checkNotExist(selector: string): Promise<void> {
  const check = await isVisible(selector);
  expect(check).toBeFalsy();
}
