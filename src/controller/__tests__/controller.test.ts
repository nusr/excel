import { Controller } from '..';
import { Model } from '@/model';

describe('controller.test.ts', () => {
  describe('undo redo', () => {
    test('normal', () => {
      const controller = new Controller(new Model());
      expect(controller.canRedo()).toEqual(false);
      expect(controller.canUndo()).toEqual(false);
    });
  });
  describe('activeCell', () => {
    test('get', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      expect(controller.getActiveCell()).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '1',
      });
    });
    test('set', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
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
  });

  describe('addSheet', () => {
    test('normal', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      expect(controller.getScroll()).toEqual({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0,
      });
    });
  });

  describe('scroll', () => {
    test('get', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      expect(controller.getScroll()).toEqual({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0,
      });
    });
    test('set', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      const headerSize = controller.getHeaderSize();
      controller.setScroll({
        top: 1000,
        left: 0,
        row: 100000,
        col: 0,
        scrollLeft: 0,
        scrollTop: 80800,
      });
      expect(controller.getScroll()).toEqual({
        top: 1000,
        left: 0,
        row: 100000,
        col: 0,
        scrollLeft: 0,
        scrollTop: 80800,
      });
      expect(controller.getHeaderSize()).toEqual({
        width: headerSize.width * 2,
        height: headerSize.height,
      });
    });
  });

  describe('copy', () => {
    test('set', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      let text = '';
      const textFormat = 'text/plain';
      const event = {
        clipboardData: {
          setData(type: string, data: string) {
            if (type === textFormat) {
              text = data;
            }
          },
        },
      };
      controller.copy(event as ClipboardEvent);
      expect(!!text).toEqual(true);
    });
  });

  describe('computeCellPosition', () => {
    test('normal', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      const headerSize = controller.getHeaderSize();
      const size = controller.computeCellPosition({
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: '',
      });
      expect(size).toEqual({
        left: headerSize.width,
        top: headerSize.height,
      });
    });
  });

  describe('RowHeight', () => {
    test('get', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      expect(controller.getRowHeight(100).len).toEqual(24);
    });
    test('set', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      controller.setRowHeight(0, 100, true);
      expect(controller.getRowHeight(0).len).toEqual(100);
    });
    test('hide', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      controller.hideRow(0, 2);
      expect(controller.getRowHeight(0).len).toEqual(0);
      expect(controller.getRowHeight(1).len).toEqual(0);
    });
  });

  describe('ColWidth', () => {
    test('get', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      expect(controller.getColWidth(100).len).toEqual(68);
    });
    test('set', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      controller.setColWidth(0, 100, true);
      expect(controller.getColWidth(0).len).toEqual(100);
    });
    test('hide', () => {
      const controller = new Controller(new Model());
      controller.addSheet();
      controller.hideCol(0, 2);
      expect(controller.getColWidth(0).len).toEqual(0);
      expect(controller.getColWidth(1).len).toEqual(0);
    });
  });
});
