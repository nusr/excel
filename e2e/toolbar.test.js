import { openPage, sleep, getTestIdSelector } from './util';
describe('toolbar.test', () => {
    beforeAll(async () => {
        await openPage();
    }, 20 * 1000);
    const clickToolbar = async function (selector) {
        await page.click(selector);
        await sleep(1000);
        const result = await page.$eval(selector, (element) => element.className);
        return result.split(' ').length > 1;
    };
    for (const item of ['bold', 'italic', 'wrap-text']) {
        test(`test toolbar ${item}`, async () => {
            expect(await clickToolbar(getTestIdSelector(`toolbar-${item}`))).toBeTruthy();
        });
    }
});
//# sourceMappingURL=toolbar.test.js.map