import { openPage, checkExist, clickDom } from './a';

describe('menubar.test', () => {
  beforeEach(async () => {
    await openPage();
  }, 20 * 1000);

  test(`test menubar exist`, async () => {
    await checkExist('menubar');
  });

  test(`test menubar click`, async () => {
    await clickDom('menubar-excel');
    await checkExist('menubar-export');
    await checkExist('menubar-import-xlsx');
  });

  test(`test menubar submenu`, async () => {
    await clickDom('menubar-excel');

    await clickDom('menubar-export');

    await checkExist('menubar-export-xlsx');
    await checkExist('menubar-export-csv');
  });
});
