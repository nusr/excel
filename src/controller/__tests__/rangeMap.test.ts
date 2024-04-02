import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('rangeMap.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), {
      async copyOrCut() {
        return '';
      },
      async paste() {
        return {
          [HTML_FORMAT]: '',
          [PLAIN_FORMAT]: '',
        };
      },
    });
    controller.addSheet();
  });
  describe('activeCell', () => {
    test('get', () => {
      expect(controller.getActiveCell()).toEqual({
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
      controller.setActiveCell({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      expect(controller.getActiveCell()).toEqual({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(controller.setNextActiveCell('up')).toEqual({
        row: 1,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(controller.setNextActiveCell('left')).toEqual({
        row: 1,
        col: 1,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(controller.setNextActiveCell('right')).toEqual({
        row: 1,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(controller.setNextActiveCell('down')).toEqual({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
  });
});
