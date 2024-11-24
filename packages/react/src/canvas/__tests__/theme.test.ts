import { initController, getMockHooks } from '../../controller';
import { IController } from '@excel/shared';
import { compareScreenShot } from './util';

describe('theme.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });

  test('light', async () => {
    controller.setCell([[true]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
    await compareScreenShot(controller, { theme: 'light' });
  });
  test('dark', async () => {
    controller.setCell([[true]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
    await compareScreenShot(controller, { theme: 'dark' });
  });
});
