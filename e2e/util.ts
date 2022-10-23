import puppeteer, { Page } from 'puppeteer';
import path from 'path';

declare global {
  var page: Page;
}

async function setupPuppeteer() {
  const browser = await puppeteer.launch();
  global.page = await browser.newPage();
}

export function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function openPage() {
  await setupPuppeteer();
  await page.goto(path.join(process.cwd(), './dist/index.html'));
  await sleep(200);
}
