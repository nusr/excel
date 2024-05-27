import { initController } from '@/controller';
import { IController } from '@/types';
import { snapshot } from './util';

describe('cell-value.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await snapshot(controller);
  });

  test('number', async () => {
    controller.setCell([[1]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('boolean', async () => {
    controller.setCell([[true, false]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('string', async () => {
    controller.setCell([['test']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('error', async () => {
    controller.setCell([['#DIV/0!']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
});
