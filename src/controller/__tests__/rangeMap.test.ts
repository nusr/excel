import { Controller } from '..';
import { Model } from '@/model';
import { EMergeCellType } from '@/types';
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
        type: EMergeCellType.MERGE_CENTER,
        firstCell: {
          row: 0,
          col: 0,
        },
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
    });
    test('set sheetId not found', () => {
      const oldData = controller.getActiveCell();
      controller.setActiveCell({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: 'test',
      });
      expect(controller.getActiveCell()).toEqual(oldData);
    });
    test('set data invalid', () => {
      const oldData = controller.getActiveCell();
      controller.setActiveCell({
        row: -2,
        col: -2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      expect(controller.getActiveCell()).toEqual(oldData);
    });
    test('undo', () => {
      const oldData = controller.getActiveCell();
      controller.setActiveCell({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.undo();
      expect(controller.getActiveCell()).toEqual(oldData);
    });
    test('redo', () => {
      controller.setActiveCell({
        row: 2,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      const newData = controller.getActiveCell();
      controller.undo();
      expect(controller.canRedo()).toEqual(true);
      controller.redo();
      expect(controller.getActiveCell()).toEqual(newData);
    });
    test('hideRow up', () => {
      controller.setActiveCell({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideRow(3, 2);
      expect(controller.setNextActiveCell('up')).toEqual({
        row: 2,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('mergeCell up', () => {
      controller.setActiveCell({
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
      expect(controller.setNextActiveCell('up')).toEqual({
        row: 4,
        col: 5,
        rowCount: 1,
        colCount: 10,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('hideRow down', () => {
      controller.setActiveCell({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideRow(6, 2);
      expect(controller.setNextActiveCell('down')).toEqual({
        row: 8,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('hideCol left', () => {
      controller.setActiveCell({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideCol(3, 2);
      expect(controller.setNextActiveCell('left')).toEqual({
        row: 5,
        col: 2,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('hideCol right', () => {
      controller.setActiveCell({
        row: 5,
        col: 5,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      controller.hideCol(6, 2);
      expect(controller.setNextActiveCell('right')).toEqual({
        row: 5,
        col: 8,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
  });
});
