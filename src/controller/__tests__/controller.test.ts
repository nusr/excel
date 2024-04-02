import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT, headerSizeSet } from '@/util';

describe('controller.test.ts', () => {
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

  describe('scroll', () => {
    test('get', () => {
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
      const headerSize = headerSizeSet.get();
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
      expect(headerSizeSet.get()).toEqual({
        width: headerSize.width * 2,
        height: headerSize.height,
      });
    });
  });

  describe('copy', () => {
    test('set', () => {
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
      const headerSize = headerSizeSet.get();
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

  describe('DomRect', () => {
    test('get', () => {
      const size = controller.getDomRect();
      expect(size).toEqual({ left: 0, top: 0, width: 0, height: 0 });
    });
  });
  describe('deleteAll', () => {
    test('normal', () => {
      controller.setDefineName(
        { row: 0, col: 0, sheetId: '', rowCount: 1, colCount: 1 },
        'foo',
      );
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.addMergeCell({
        row: 20,
        col: 20,
        rowCount: 3,
        colCount: 3,
        sheetId: '',
      });
      controller.setColWidth(40, 100);
      controller.setRowHeight(40, 200);
      controller.addDrawing({
        width: 400,
        height: 300,
        originHeight: 300,
        originWidth: 400,
        title: 'chart',
        type: 'chart',
        uuid: 'test',
        sheetId: controller.getCurrentSheetId(),
        fromRow: 10,
        fromCol: 10,
        chartRange: {
          row: 0,
          col: 0,
          rowCount: 4,
          colCount: 4,
          sheetId: controller.getCurrentSheetId(),
        },
        chartType: 'line',
        marginX: 0,
        marginY: 0,
      });
      controller.deleteAll();
      expect(controller.checkDefineName('foo')).toBeNull();
      expect(controller.getDrawingList()).toHaveLength(0);
      expect(controller.getColWidth(40).len).not.toEqual(100);
      expect(controller.getRowHeight(40).len).not.toEqual(200);
      expect(controller.getMergeCellList()).toHaveLength(0);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          sheetId: '',
          rowCount: 1,
          colCount: 1,
        }),
      ).toBeNull();
    });
  });
});
