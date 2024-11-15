import { IController } from '@/types';
import { initController, getMockHooks } from '..';

describe('rangeMap.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  describe('activeCell', () => {
    test('get', () => {
      expect(controller.getActiveRange().range).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '1',
      });
      expect(controller.getActiveRange()).toEqual({
        range: {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '1',
        },
        isMerged: false,
      });
    });
    test('set', () => {
      controller.setActiveRange({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      expect(controller.getActiveRange().range).toEqual({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('set sheetId not found', () => {
      const oldData = controller.getActiveRange().range;
      controller.setActiveRange({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: 'test',
      });
      expect(controller.getActiveRange().range).toEqual(oldData);
    });
    test('set data invalid', () => {
      const oldData = controller.getActiveRange().range;
      controller.setActiveRange({
        row: -2,
        col: -2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      expect(controller.getActiveRange().range).toEqual(oldData);
    });
    test('undo', async () => {
      controller.setActiveRange({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });

      controller.undo();
      expect(controller.getActiveRange().range).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('redo', () => {
      controller.setActiveRange({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      const newData = controller.getActiveRange().range;
      controller.undo();
      expect(controller.canRedo()).toEqual(true);
      controller.redo();
      expect(controller.getActiveRange().range).toEqual(newData);
    });
    test('hideRow up', () => {
      controller.setActiveRange({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideRow(3, 2);
      controller.setNextActiveCell('up');
      expect(controller.getActiveRange().range).toEqual({
        row: 2,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('mergeCell up', () => {
      controller.setActiveRange({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.addMergeCell({
        row: 4,
        col: 5,
        rowCount: 1,
        colCount: 10,
        sheetId: '',
      });
      controller.setNextActiveCell('up');
      expect(controller.getActiveRange().range).toEqual({
        row: 4,
        col: 5,
        rowCount: 1,
        colCount: 10,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('hideRow down', () => {
      controller.setActiveRange({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideRow(6, 2);
      controller.setNextActiveCell('down');
      expect(controller.getActiveRange().range).toEqual({
        row: 8,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('hideCol left', () => {
      controller.setActiveRange({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideCol(3, 2);
      controller.setNextActiveCell('left');
      expect(controller.getActiveRange().range).toEqual({
        row: 5,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('hideCol right', () => {
      controller.setActiveRange({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideCol(6, 2);
      controller.setNextActiveCell('right');
      expect(controller.getActiveRange().range).toEqual({
        row: 5,
        col: 8,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
  });
});
