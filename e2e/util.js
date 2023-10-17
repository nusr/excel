import * as puppeteer from 'puppeteer';
async function setupPuppeteer() {
    const browser = await puppeteer.launch({
        headless: "new"
    });
    global.page = await browser.newPage();
}
export function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
export async function openPage() {
    await setupPuppeteer();
    const filePath = `http://localhost:8000`;
    await page.goto(filePath);
    await sleep(200);
}
export function getTestIdSelector(testId) {
    return `[data-testid="${testId}"]`;
}
//# sourceMappingURL=util.js.map