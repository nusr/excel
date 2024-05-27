import { initController } from '@/controller';
import { IController } from '@/types';
import { compareScreenShot } from './util';

describe('range.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
  });

  test('cell', async () => {
    controller.setActiveRange({
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
  });

  test('row', async () => {
    controller.setActiveRange({
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 0,
      sheetId: '',
    });
  });
  test('col', async () => {
    controller.setActiveRange({
      row: 0,
      col: 0,
      rowCount: 0,
      colCount: 1,
      sheetId: '',
    });
  });
  test('all', async () => {
    controller.setActiveRange({
      row: 0,
      col: 0,
      rowCount: 0,
      colCount: 0,
      sheetId: '',
    });
  });
});
