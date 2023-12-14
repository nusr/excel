import * as puppeteer from 'puppeteer';
import fs from 'fs';
declare global {
  // eslint-disable-next-line no-var
  var browserPage: puppeteer.Page;
  const __portFilePath: string;
}

let port = 8000;

beforeAll(async () => {
  await setupPuppeteer();
  await sleep(500);
  getPort();
});
afterAll(async () => {
  await browserPage.close();
});

async function setupPuppeteer() {
  const browser = await puppeteer.launch({
    headless: 'new',
    waitForInitialPage: true,
    defaultViewport: {
      width: 1600,
      height: 800,
    },
  });
  browserPage = await browser.newPage();
}

function getPort() {
  const filePath = __portFilePath;
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
  await sleep(200);
}

export function getTestIdSelector(testId: string): string {
  return `[data-testid="${testId}"]`;
}

export async function clickDom(selector: string): Promise<void> {
  await browserPage.click(getTestIdSelector(selector));
  await sleep(200);
}

export async function checkExist(selector: string): Promise<void> {
  const dom = await browserPage.$(getTestIdSelector(selector));
  expect(dom).not.toBeNull();
}
