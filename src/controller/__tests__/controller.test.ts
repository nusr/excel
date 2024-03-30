import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

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
  describe('undo redo', () => {
    test('normal', () => {
      const c = (controller = new Controller(new Model(), {
        async copyOrCut() {
          return '';
        },
        async paste() {
          return {
            [HTML_FORMAT]: '',
            [PLAIN_FORMAT]: '',
          };
        },
      }));
      expect(c.canRedo()).toEqual(false);
      expect(c.canUndo()).toEqual(false);
    });
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

  describe('sheet', () => {
    test('addSheet', () => {
      expect(controller.getScroll()).toEqual({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0,
      });
      expect(controller.getSheetList()).toHaveLength(1);
      controller.addSheet();
      expect(controller.getSheetList()).toHaveLength(2);
    });

    test('deleteSheet', () => {
      const sheetId = controller.getCurrentSheetId();
      controller.addSheet();
      expect(controller.getSheetList()).toHaveLength(2);
      controller.deleteSheet(controller.getCurrentSheetId());
      expect(controller.getSheetList()).toHaveLength(1);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
    });

    test('hideSheet', () => {
      const sheetId = controller.getCurrentSheetId();
      controller.addSheet();
      controller.hideSheet(controller.getCurrentSheetId());
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
      expect(controller.getSheetList()).toHaveLength(2);
    });

    test('unhideSheet', () => {
      controller.addSheet();
      const sheetId = controller.getCurrentSheetId();
      controller.hideSheet(sheetId);
      controller.unhideSheet(sheetId);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
      expect(controller.getSheetList()).toHaveLength(2);
    });

    test('undo redo', () => {
      const firstSheetId = controller.getCurrentSheetId();
      controller.addSheet();
      const sheetId = controller.getCurrentSheetId();
      expect(controller.getSheetList()).toHaveLength(2);
      controller.undo();
      expect(firstSheetId).toEqual(controller.getCurrentSheetId());
      expect(controller.getSheetList()).toHaveLength(1);
      controller.redo();
      expect(controller.getSheetList()).toHaveLength(2);
      expect(sheetId).toEqual(controller.getCurrentSheetId());
    });
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
  describe('row', () => {
    test('add', () => {
      const old = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!.rowCount;
      controller.addRow(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old + 10);

      controller.addRow(20, 0);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old + 10);
    });
    test('delete', () => {
      const old = controller.getSheetInfo(controller.getCurrentSheetId())!;
      controller.deleteRow(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old.rowCount - 10);

      controller.deleteRow(20, -1);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old.rowCount - 10);
    });
    test('hide', () => {
      controller.hideRow(20, 1);
      expect(controller.getRowHeight(20).len).toEqual(0);
    });
    test('undo redo', () => {
      const old = controller.getRowHeight(20).len;
      controller.hideRow(20, 1);
      expect(controller.getRowHeight(20).len).toEqual(0);
      controller.undo();
      expect(controller.getRowHeight(20).len).toEqual(old);
      controller.redo();
      expect(controller.getRowHeight(20).len).toEqual(0);
    });
  });
  describe('col', () => {
    test('add', () => {
      const old = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!.colCount;
      controller.addCol(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old + 10);

      controller.addCol(20, 0);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old + 10);
    });
    test('delete', () => {
      const old = controller.getSheetInfo(controller.getCurrentSheetId())!;
      controller.deleteCol(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old.colCount - 10);

      controller.deleteCol(20, -1);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old.colCount - 10);
    });
    test('hide', () => {
      controller.hideCol(20, 1);
      expect(controller.getColWidth(20).len).toEqual(0);
    });
    test('undo redo', () => {
      const old = controller.getColWidth(20).len;
      controller.hideCol(20, 1);
      expect(controller.getColWidth(20).len).toEqual(0);
      controller.undo();
      expect(controller.getColWidth(20).len).toEqual(old);
      controller.redo();
      expect(controller.getColWidth(20).len).toEqual(0);
    });
  });

  describe('RowHeight', () => {
    test('get', () => {
      expect(controller.getRowHeight(100).len).toEqual(24);
    });
    test('set', () => {
      controller.setRowHeight(0, 100);
      expect(controller.getRowHeight(0).len).toEqual(100);
    });
    test('hide', () => {
      controller.hideRow(0, 2);
      expect(controller.getRowHeight(0).len).toEqual(0);
      expect(controller.getRowHeight(1).len).toEqual(0);
    });
    test('undo redo', () => {
      const old = controller.getRowHeight(0).len;
      controller.setRowHeight(0, 300);
      expect(controller.getRowHeight(0).len).toEqual(300);

      controller.undo();
      expect(controller.getRowHeight(0).len).toEqual(old);

      controller.redo();
      expect(controller.getRowHeight(0).len).toEqual(300);
    });
  });

  describe('ColWidth', () => {
    test('get', () => {
      expect(controller.getColWidth(100).len).toEqual(68);
    });
    test('set', () => {
      controller.setColWidth(0, 100);
      expect(controller.getColWidth(0).len).toEqual(100);
    });
    test('hide', () => {
      controller.hideCol(0, 2);
      expect(controller.getColWidth(0).len).toEqual(0);
      expect(controller.getColWidth(1).len).toEqual(0);
    });

    test('undo redo', () => {
      const old = controller.getColWidth(0).len;
      controller.setColWidth(0, 300);
      expect(controller.getColWidth(0).len).toEqual(300);

      controller.undo();
      expect(controller.getColWidth(0).len).toEqual(old);
      controller.redo();
      expect(controller.getColWidth(0).len).toEqual(300);

      controller.hideCol(0, 1);
      expect(controller.getColWidth(0).len).toEqual(0);
      controller.undo();
      expect(controller.getColWidth(0).len).toEqual(300);
    });
  });
  describe('float element', () => {
    test('add', () => {
      controller.setCellValues(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        [{ row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' }],
      );
      controller.addFloatElement({
        title: 'chart',
        type: 'chart',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getFloatElementList('')).toHaveLength(1);

      controller.deleteFloatElement('1');
      expect(controller.getFloatElementList('')).toHaveLength(0);
    });
    test('undo redo', () => {
      controller.setCellValues(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        [{ row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' }],
      );
      controller.addFloatElement({
        title: 'chart',
        type: 'chart',
        chartType: 'line',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getFloatElementList('')).toHaveLength(1);
      controller.undo();
      expect(controller.getFloatElementList('')).toHaveLength(0);
      controller.redo();
      expect(controller.getFloatElementList('')).toHaveLength(1);

      controller.updateFloatElement('1', {
        width: 100,
        height: 100,
        chartType: 'bar',
      });
      expect(
        controller.getFloatElementList('').find((v) => v.uuid === '1')!.width,
      ).toEqual(100);
      expect(
        controller.getFloatElementList('').find((v) => v.uuid === '1')!.height,
      ).toEqual(100);
      expect(
        controller.getFloatElementList('').find((v) => v.uuid === '1')!
          .chartType,
      ).toEqual('bar');

      controller.undo();
      expect(
        controller.getFloatElementList('').find((v) => v.uuid === '1')!.width,
      ).toEqual(300);
      expect(
        controller.getFloatElementList('').find((v) => v.uuid === '1')!.height,
      ).toEqual(300);
      expect(
        controller.getFloatElementList('').find((v) => v.uuid === '1')!
          .chartType,
      ).toEqual('line');
    });
  });
  describe('DomRect', () => {
    test('get', () => {
      const size = controller.getDomRect();
      expect(size).toEqual({ left: 0, top: 0, width: 0, height: 0 });
    });
  });
  describe('define name', () => {
    test('get', () => {
      const list = controller.getDefineNameList();
      expect(list).toHaveLength(0);
    });
    test('set', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );
      const list = controller.getDefineNameList();
      expect(list).toHaveLength(1);
      expect(controller.checkDefineName('foo')).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('undo redo', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );
      expect(controller.getDefineNameList()).toHaveLength(1);

      controller.undo();
      expect(controller.getDefineNameList()).toHaveLength(0);
      controller.redo();
      expect(controller.getDefineNameList()).toHaveLength(1);
    });
  });
  describe('sheetId', () => {
    test('get', () => {
      expect(!!controller.getCurrentSheetId()).toBeTruthy();
    });
    test('set', () => {
      const old = controller.getCurrentSheetId();
      controller.setCurrentSheetId('333');
      expect(controller.getCurrentSheetId()).toEqual(old);
      controller.setCurrentSheetId(old);
      expect(controller.getCurrentSheetId()).toEqual(old);

      controller.addSheet();
      expect(controller.getCurrentSheetId()).not.toEqual(old);
    });
  });
  describe('cell value', () => {
    test('getCell', () => {
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
    });
    test('set value', () => {
      controller.setCellValues(
        [[1]],
        [],
        [
          {
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          },
        ],
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0 });
    });
    test('set formula', () => {
      controller.setCellValues(
        [['=SUM(1,2)']],
        [],
        [
          {
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          },
        ],
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ formula: '=SUM(1,2)', row: 0, col: 0, value: 3 });
    });
    test('undo redo', () => {
      controller.setCellValues(
        [[1]],
        [],
        [
          {
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          },
        ],
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0 });
      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0 });
    });
  });
  describe('cell style', () => {
    test('get', () => {
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
    });
    test('set', () => {
      controller.setCellValues(
        [[1]],
        [[{ isBold: true }]],
        [
          {
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          },
        ],
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0, style: { isBold: true } });
    });
    test('undo redo', () => {
      controller.setCellValues(
        [[1]],
        [[{ isBold: true }]],
        [
          {
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          },
        ],
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0, style: { isBold: true } });

      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0, style: { isBold: true } });
    });
  });
});
