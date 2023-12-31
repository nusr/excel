import { openPage, checkExist, checkNotExist, sleep } from './a';

describe('canvasBottomBar.test', () => {
  beforeEach(async () => {
    await openPage();
  }, 20 * 1000);

  test('test menubar not exist', async () => {
    await checkNotExist('canvas-bottom-bar');
  });

  test('test menubar  exist', async () => {
    await browserPage.keyboard.down('Control');
    await browserPage.keyboard.down('Meta');
    await browserPage.keyboard.press('ArrowDown');
    await sleep(1000);
    await checkExist('canvas-bottom-bar');
  });
});
