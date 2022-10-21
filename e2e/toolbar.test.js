/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require("puppeteer");
const path = require("path");

async function setupPuppeteer() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  global.page = page;
}

describe("toolbar.test", () => {
  beforeAll(async () => {
    await setupPuppeteer();
    await page.goto(path.join(process.cwd(), "./dist/index.html"));
    await page.waitForTimeout(200);
  });

  const clickToolbar = async function (selector) {
    await page.click(selector);

    await page.waitForTimeout(500);
    const result = await page.$eval(selector, (element) => element.className);
    return result;
  };

  test("test italic", async () => {
    expect(
      await clickToolbar("#tool-bar-container > div:nth-child(3)")
    ).toContain("active");
    expect(
      await clickToolbar("#tool-bar-container > div:nth-child(4)")
    ).toContain("active");
    expect(
      await clickToolbar("#tool-bar-container > div:nth-child(5)")
    ).toContain("active");
  });
});
