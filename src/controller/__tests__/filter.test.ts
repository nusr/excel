import { Controller } from '..';
import { Model } from '@/model';
import { mockTestHooks } from '../init';

describe('filter.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), mockTestHooks);
    controller.addSheet();
  });
  test('not valid', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 1,
      rowCount: 1,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).toBeUndefined();
  });
  test('add', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).not.toBeUndefined();
  });
  test('delete', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).not.toBeUndefined();
    controller.deleteFilter(sheetId);
    expect(controller.getFilter(sheetId)).toBeUndefined();
  });
  test('update', () => {
    const sheetId = controller.getCurrentSheetId();
    controller.addFilter({
      row: 0,
      col: 0,
      colCount: 10,
      rowCount: 10,
      sheetId,
    });
    expect(controller.getFilter(sheetId)).not.toBeUndefined();
    controller.updateFilter(sheetId, {
      col: 1,
      value: { type: 'normal', value: [1, 'test'] },
    });
    expect(controller.getFilter(sheetId)?.col).not.toBeUndefined();
    expect(controller.getFilter(sheetId)?.value).not.toBeUndefined();
  });
});
