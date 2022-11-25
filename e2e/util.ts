import * as puppeteer from 'puppeteer';

declare global {
  var page: puppeteer.Page;
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
  const filePath = `file://${process.cwd()}/dist/index.html`;
  console.log(filePath);
  await page.goto(filePath);
  await sleep(200);
}

export function getTestIdSelector(testId: string) {
  return `[data-test-id="${testId}"]`
}