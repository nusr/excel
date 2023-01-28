import { Controller } from '..';
import { Model, History } from '@/model';

describe('controller.test.ts', () => {
  describe('undo redo', () => {
    test('normal', () => {
      const controller = new Controller(new Model(new History()));
      expect(controller.canRedo()).toEqual(false);
      expect(controller.canUndo()).toEqual(false);
    });
  });
  describe('activeCell', () => {
    test('get', () => {
      const controller = new Controller(new Model(new History()));
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
      const controller = new Controller(new Model(new History()));
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
      const controller = new Controller(new Model(new History()));
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
      const controller = new Controller(new Model(new History()));
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
      const controller = new Controller(new Model(new History()));
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
      const controller = new Controller(new Model(new History()));
      controller.addSheet();
      let text: string = '';
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
      const controller = new Controller(new Model(new History()));
      controller.addSheet();
      const headerSize = controller.getHeaderSize();
      const size = controller.computeCellPosition(0, 0);
      expect({
        top: size.top,
        left: size.left,
      }).toEqual({
        left: headerSize.width,
        top: headerSize.height,
      });
    });
  });

  describe('RowHeight', () => {
    test('get', () => {
      const controller = new Controller(new Model(new History()));
      controller.addSheet();
      expect(controller.getRowHeight(0)).toEqual(controller.getRowHeight(1));
    });
    test('set', () => {
      const controller = new Controller(new Model(new History()));
      controller.addSheet();
      controller.setRowHeight(0, 100);
      expect(controller.getRowHeight(0)).toEqual(100);
    });
  });
});
