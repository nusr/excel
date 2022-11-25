import { openPage, sleep, getTestIdSelector } from './util';

describe('toolbar.test', () => {
  beforeAll(async () => {
    await openPage();
  });

  const clickToolbar = async function (selector: string) {
    await page.click(selector);
    await sleep(500);
    const result = await page.$eval(selector, (element) => element.className);
    return result;
  };
  for (const item of ['bold', 'italic', 'wrap-text']) {
    test(`test toolbar ${item}`, async () => {
      expect(
        await clickToolbar(getTestIdSelector(`toolbar-${item}`)),
      ).toContain('active');
    });
  }
});
