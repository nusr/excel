import { initController, getMockHooks } from '../../controller';
import { IController } from '@excel/shared';
import { compareScreenShot } from './util';

describe('filter.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
  });

  test('filter', async () => {
    controller.setCell([['a', 'b']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: controller.getCurrentSheetId(),
    });

    controller.addFilter({
      row: 0,
      col: 0,
      rowCount: 10,
      colCount: 10,
      sheetId: controller.getCurrentSheetId(),
    });
  });

  test('filtering', async () => {
    controller.setCell([['a', 'b']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: controller.getCurrentSheetId(),
    });

    controller.addFilter({
      row: 0,
      col: 0,
      rowCount: 10,
      colCount: 10,
      sheetId: controller.getCurrentSheetId(),
    });
    controller.updateFilter('', { col: 1 });
  });
});
