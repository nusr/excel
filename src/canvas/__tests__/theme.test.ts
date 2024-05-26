import { initController } from '@/controller';
import { IController } from '@/types';
import { snapshot } from './util';

describe('theme.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });

  test('light', async () => {
    controller.setCell([[true]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
    await snapshot(controller, 'light');
  });
  test('dark', async () => {
    controller.setCell([[true]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
    await snapshot(controller, 'dark');
  });
});
