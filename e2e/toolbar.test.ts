import { openPage, sleep } from './util';

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

  test('test italic', async () => {
    expect(
      await clickToolbar('.toolbar-wrapper > div:nth-child(3)'),
    ).toContain('active');
    expect(
      await clickToolbar('.toolbar-wrapper > div:nth-child(4)'),
    ).toContain('active');
    expect(
      await clickToolbar('.toolbar-wrapper > div:nth-child(5)'),
    ).toContain('active');
  });
});
