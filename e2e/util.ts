import * as puppeteer from 'puppeteer';

declare global {
  var page: puppeteer.Page;
}

async function setupPuppeteer() {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  global.page = await browser.newPage();
}

export function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function openPage() {
  await setupPuppeteer();
  const filePath = `http://localhost:8000`;
  await page.goto(filePath);
  await sleep(1000);
}

export function getTestIdSelector(testId: string) {
  return `[data-testid="${testId}"]`
}