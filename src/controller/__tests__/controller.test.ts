import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT, headerSizeSet } from '@/util';
import { WorkBookJSON, EUnderLine, EMergeCellType } from '@/types';

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

  describe('paste', () => {
    test('html', () => {
      const mockHTML = `<html>
      <head>
        <style>
          .xl1{
            color:#738DF2;
            background-color:#FCE869;
            font-size:36pt;
            font-style:italic;
            font-weight:700;
            white-space:normal;
            text-decoration-line:underline line-through;
            text-decoration-style: double;
          }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td class="xl1"><i>=SUM(1,2)</i> </td>
          </tr>
        </table>
      </body>
    </html>`;
      const event = {
        clipboardData: {
          getData(format: string) {
            if (format === HTML_FORMAT) {
              return mockHTML;
            }
            return '';
          },
        },
      } as ClipboardEvent;
      controller.paste(event);
      const sheetData = controller.getWorksheet(controller.getCurrentSheetId());
      expect(controller.getActiveCell()).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(sheetData).toEqual({
        '0_0': {
          value: 3,
          formula: '=SUM(1,2)',
          style: {
            fillColor: '#FCE869',
            fontColor: '#738DF2',
            fontSize: 36,
            isItalic: true,
            isBold: true,
            isStrike: true,
            isWrapText: true,
            underline: EUnderLine.DOUBLE,
          },
        },
      });
    });
    test('text', () => {
      const mockData = '=SUM(1,2)\t2\ntest\ttrue';
      const event = {
        clipboardData: {
          getData(format: string) {
            if (format === PLAIN_FORMAT) {
              return mockData;
            }
            return '';
          },
        },
      } as ClipboardEvent;
      controller.paste(event);
      const sheetData = controller.getWorksheet(controller.getCurrentSheetId());
      expect(controller.getActiveCell()).toEqual({
        row: 0,
        col: 0,
        rowCount: 2,
        colCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(sheetData).toEqual({
        '0_0': {
          value: 3,
          formula: '=SUM(1,2)',
        },
        '0_1': {
          value: 2,
        },
        '1_0': {
          value: 'test',
        },
        '1_1': {
          value: true,
        },
      });
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
    test('set 10', () => {
      const headerSize = headerSizeSet.get();
      controller.setScroll({
        top: 1000,
        left: 0,
        row: 10,
        col: 0,
        scrollLeft: 0,
        scrollTop: 80800,
      });
      expect(controller.getScroll()).toEqual({
        top: 1000,
        left: 0,
        row: 10,
        col: 0,
        scrollLeft: 0,
        scrollTop: 80800,
      });
      expect(headerSizeSet.get()).toEqual({
        width: headerSize.width,
        height: headerSize.height,
      });
    });
    test('set 100000', () => {
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
    test('distance', () => {
      const size = controller.computeCellPosition({
        row: 5,
        col: 5,
        colCount: 1,
        rowCount: 1,
        sheetId: '',
      });
      const size2 = controller.computeCellPosition({
        row: 6,
        col: 6,
        colCount: 1,
        rowCount: 1,
        sheetId: '',
      });
      expect(size2.left - size.left).toEqual(controller.getColWidth(5).len);
      expect(size2.top - size.top).toEqual(controller.getRowHeight(5).len);
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
  describe('json', () => {
    test('toJSON', () => {
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
      controller.setRowHeight(50, 200);
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
      const sheetId = controller.getCurrentSheetId();
      controller.setActiveCell({
        row: 3,
        col: 3,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      const result: WorkBookJSON = {
        currentSheetId: sheetId,
        rangeMap: {
          [sheetId]: { row: 3, col: 3, rowCount: 1, colCount: 1, sheetId },
        },
        workbook: {
          [sheetId]: {
            rowCount: 200,
            colCount: 30,
            sort: 1,
            name: 'Sheet1',
            sheetId,
            isHide: false,
          },
        },
        definedNames: {
          foo: { row: 0, col: 0, sheetId, rowCount: 1, colCount: 1 },
        },
        worksheets: {
          [sheetId]: {
            '0_0': {
              value: 1,
              style: {
                isBold: true,
              },
            },
          },
        },
        mergeCells: {
          'Sheet1!$U$21:$X$24': {
            range: {
              row: 20,
              col: 20,
              rowCount: 3,
              colCount: 3,
              sheetId,
            },
            type: EMergeCellType.MERGE_CENTER,
            firstCell: {
              row: 20,
              col: 20,
            },
          },
        },
        customHeight: {
          [`${sheetId}_50`]: {
            len: 200,
            isHide: false,
          },
        },
        customWidth: {
          [`${sheetId}_40`]: {
            len: 100,
            isHide: false,
          },
        },
        drawings: {
          test: {
            width: 400,
            height: 300,
            originHeight: 300,
            originWidth: 400,
            title: 'chart',
            type: 'chart',
            uuid: 'test',
            sheetId,
            fromRow: 10,
            fromCol: 10,
            chartRange: {
              row: 0,
              col: 0,
              rowCount: 4,
              colCount: 4,
              sheetId,
            },
            chartType: 'line',
            marginX: 0,
            marginY: 0,
          },
        },
      };
      expect(controller.toJSON()).toEqual(result);
    });
    test('fromJSON', () => {
      const sheetId = '1';
      const result: WorkBookJSON = {
        currentSheetId: sheetId,
        rangeMap: {
          [sheetId]: { row: 3, col: 3, rowCount: 1, colCount: 1, sheetId },
        },
        workbook: {
          [sheetId]: {
            rowCount: 200,
            colCount: 30,
            sort: 1,
            name: 'Sheet1',
            sheetId,
            isHide: false,
          },
        },
        definedNames: {
          foo: { row: 0, col: 0, sheetId, rowCount: 1, colCount: 1 },
        },
        worksheets: {
          [sheetId]: {
            '0_0': {
              formula: '=SUM(1,2)',
              value: '',
              style: {
                isBold: true,
              },
            },
          },
        },
        mergeCells: {
          'Sheet1!$U$21:$X$24': {
            range: {
              row: 20,
              col: 20,
              rowCount: 3,
              colCount: 3,
              sheetId,
            },
            type: EMergeCellType.MERGE_CENTER,
            firstCell: {
              row: 20,
              col: 20,
            },
          },
        },
        customHeight: {
          [`${sheetId}_50`]: {
            len: 200,
            isHide: false,
          },
        },
        customWidth: {
          [`${sheetId}_40`]: {
            len: 300,
            isHide: false,
          },
        },
        drawings: {
          test: {
            width: 400,
            height: 300,
            originHeight: 300,
            originWidth: 400,
            title: 'chart',
            type: 'chart',
            uuid: 'test',
            sheetId,
            fromRow: 10,
            fromCol: 10,
            chartRange: {
              row: 0,
              col: 0,
              rowCount: 4,
              colCount: 4,
              sheetId,
            },
            chartType: 'line',
            marginX: 0,
            marginY: 0,
          },
        },
      };
      controller.fromJSON(result);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
      expect(controller.getSheetList()).toHaveLength(1);
      expect(controller.getDefineNameList()).toHaveLength(1);
      expect(controller.getMergeCellList()).toHaveLength(1);
      expect(controller.getDrawingList()).toHaveLength(1);
      expect(controller.getColWidth(40).len).toEqual(300);
      expect(controller.getRowHeight(50).len).toEqual(200);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId,
        }),
      ).toEqual({
        row: 0,
        col: 0,
        formula: '=SUM(1,2)',
        value: 3,
        style: {
          isBold: true,
        },
      });
    });
  });
});
