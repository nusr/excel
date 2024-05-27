import { initController } from '@/controller';
import { IController } from '@/types';
import { compareScreenShot } from './util';

describe('cell-value.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
  });

  test('number', () => {
    controller.setCell([[1]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('boolean', () => {
    controller.setCell([[true, false]], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('string', () => {
    controller.setCell([['test']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('empty string', () => {
    controller.setCell([['']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
  test('error', () => {
    controller.setCell([['#DIV/0!']], [], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });
});
