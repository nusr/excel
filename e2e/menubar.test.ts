import { openPage, checkExist, clickDom } from './a';

describe('menubar.test', () => {
  beforeEach(async () => {
    await openPage();
  }, 20 * 1000);

  test(`test menubar exist`, async () => {
    await checkExist('menubar');
  });

  test(`test menubar click`, async () => {
    await clickDom('menubar');
    await checkExist('menubar-import-xlsx');
    await checkExist('menubar-export');
  });

  test(`test menubar submenu`, async () => {
    await clickDom('menubar');

    await clickDom('menubar-export');

    await checkExist('menubar-import-xlsx');
    await checkExist('menubar-export-csv');
  });
});
