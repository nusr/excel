import { initController } from '..';
import { HTML_FORMAT, PLAIN_FORMAT, CUSTOM_FORMAT, parseHTML } from '../../util';
import { ModelJSON, EUnderLine, ModelCellType, WorksheetData, IController } from '../../types';
import { waitFor } from '@testing-library/react';
import { mergeCellKey } from '../../protocol';

describe('controller.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
    controller.addSheet();
  });

  describe('paste', () => {
    test('preserves leading empty cells and rows in plain text', async () => {
      const event = {
        clipboardData: {
          getData: (format: string) => (format === PLAIN_FORMAT ? '\tA\n\nB\tC' : ''),
        },
      } as ClipboardEvent;
      await controller.paste(event);
      const range = controller.getActiveRange().range;
      expect(range).toMatchObject({ row: 0, col: 0, rowCount: 3, colCount: 2 });
      expect(controller.getCell({ ...range, col: 1 })?.value).toBe('A');
      expect(controller.getCell({ ...range, row: 2 })?.value).toBe('B');
    });
    test('ignores malformed custom data and pastes plain text', async () => {
      for (const custom of ['{', '{}', '{"type":"cut","range":null}']) {
        const event = {
          clipboardData: {
            getData: (format: string) =>
              format === CUSTOM_FORMAT ? custom : format === PLAIN_FORMAT ? 'safe' : '',
          },
        } as ClipboardEvent;
        await expect(controller.paste(event)).resolves.toBeUndefined();
        expect(controller.getCell(controller.getActiveRange().range)?.value).toBe('safe');
      }
    });
    test('applies pasted dimensions relative to the destination', async () => {
      const range = { ...controller.getActiveRange().range, row: 3, col: 4 };
      controller.setActiveRange(range);
      const originalHeight = controller.getRow(0).len;
      const originalWidth = controller.getCol(0).len;
      const event = {
        clipboardData: {
          getData: (format: string) =>
            format === HTML_FORMAT
              ? '<table><tr style="height:60px"><td style="width:180px">A</td></tr></table>'
              : '',
        },
      } as ClipboardEvent;
      await controller.paste(event);
      expect(controller.getRow(3).len).toBe(60);
      expect(controller.getCol(4).len).toBe(180);
      expect(controller.getRow(0).len).toBe(originalHeight);
      expect(controller.getCol(0).len).toBe(originalWidth);
    });
    test('consumes cut state without clearing clipboard data or cutting the source twice', async () => {
      const source = controller.getActiveRange().range;
      controller.setCellValue('original', source);
      const data = new Map<string, string>();
      const event = {
        clipboardData: {
          setData: (format: string, value: string) => data.set(format, value),
          getData: (format: string) => data.get(format) || '',
        },
      } as unknown as ClipboardEvent;
      await controller.cut(event);
      controller.setActiveRange({ ...source, row: 1 });
      await controller.paste(event);
      expect(controller.getCell(source)).toBeUndefined();
      expect(controller.getCopyRange()).toBeUndefined();
      expect(data.get(PLAIN_FORMAT)).toBe('original\r\n');
      controller.setCellValue('replacement', source);
      controller.setActiveRange({ ...source, row: 2 });
      await controller.paste(event);
      expect(controller.getCell(source)?.value).toBe('replacement');
      expect(controller.getCell({ ...source, row: 2 })?.value).toBe('original');
    });
    test('treats foreign cut metadata as content instead of deleting local cells', async () => {
      const range = controller.getActiveRange().range;
      controller.setCellValue('keep', range);
      controller.setActiveRange({ ...range, row: 1 });
      const event = {
        clipboardData: {
          getData: (format: string) =>
            format === CUSTOM_FORMAT
              ? JSON.stringify({ type: 'cut', range, floatElementUuid: '', clipboardId: 'foreign' })
              : format === PLAIN_FORMAT
                ? 'external'
                : '',
        },
      } as ClipboardEvent;
      await controller.paste(event);
      expect(controller.getCell(range)?.value).toBe('keep');
      expect(controller.getCell({ ...range, row: 1 })?.value).toBe('external');
    });
    test('html', async () => {
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
      expect(controller.getActiveRange().range).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      const result: ModelCellType = {
        value: 3,
        formula: '=SUM(1,2)',
        fillColor: '#FCE869',
        fontColor: '#738DF2',
        fontSize: 36,
        isItalic: true,
        isBold: true,
        isStrike: true,
        isWrapText: true,
        underline: EUnderLine.DOUBLE,
      };
      await waitFor(() => {
        expect(
          controller.getCell({
            row: 0,
            col: 0,
            rowCount: 1,
            colCount: 1,
            sheetId: controller.getCurrentSheetId(),
          }),
        ).toEqual(result);
      });
    });
    test('text', async () => {
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
      expect(controller.getActiveRange().range).toEqual({
        row: 0,
        col: 0,
        rowCount: 2,
        colCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      const sheetId = controller.getCurrentSheetId();
      const result: WorksheetData = [
        {
          row: 0,
          col: 0,
          sheetId,
          value: 3,
          formula: '=SUM(1,2)',
        },
        {
          row: 0,
          col: 1,
          sheetId,
          value: 2,
        },
        {
          row: 1,
          col: 0,
          sheetId,
          value: 'test',
        },
        {
          row: 1,
          col: 1,
          sheetId,
          value: true,
        },
      ];
      await waitFor(() => {
        expect(controller.getWorksheet(controller.getCurrentSheetId())).toEqual(result);
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
    });
    test('set 100000', () => {
      controller.updateSheetInfo({ rowCount: 100000 + 100 });
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
    });
  });

  describe('copy', () => {
    test('writes event clipboard synchronously and preserves empty cells and literal HTML', async () => {
      const range = { ...controller.getActiveRange().range, colCount: 3 };
      controller.setCellValue('<b>A&B</b>', { ...range, col: 1 });
      controller.setActiveRange(range);
      const data = new Map<string, string>();
      const event = {
        clipboardData: { setData: (format: string, value: string) => data.set(format, value) },
      } as unknown as ClipboardEvent;
      const copied = controller.copy(event);
      expect(data.get(PLAIN_FORMAT)).toBe('\t<b>A&B</b>\t\r\n');
      expect(parseHTML(data.get(HTML_FORMAT)!).textList).toEqual([['', '<b>A&B</b>', '']]);
      await copied;
    });
    test('set', async () => {
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
      await controller.copy(event as ClipboardEvent);
      expect(!!text).toEqual(true);
    });
  });

  describe('computeCellPosition', () => {
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
      expect(size2.left - size.left).toEqual(controller.getCol(5).len);
      expect(size2.top - size.top).toEqual(controller.getRow(5).len);
    });
  });

  describe('deleteAll', () => {
    test('normal', () => {
      controller.setDefineName({ row: 0, col: 0, sheetId: '', rowCount: 1, colCount: 1 }, 'foo');
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
      expect(controller.checkDefineName('foo')).toBeUndefined();
      expect(controller.getDrawingList()).toHaveLength(0);
      expect(controller.getCol(40).len).not.toEqual(100);
      expect(controller.getRow(40).len).not.toEqual(200);
      expect(controller.getMergeCellList()).toHaveLength(0);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          sheetId: '',
          rowCount: 1,
          colCount: 1,
        }),
      ).toBeUndefined();
    });
  });
  describe('json', () => {
    test('toJSON', () => {
      controller.setDefineName({ row: 0, col: 0, sheetId: '', rowCount: 1, colCount: 1 }, 'foo');
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
      controller.setActiveRange({
        row: 3,
        col: 3,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      const result: ModelJSON = {
        scroll: {},
        currentSheetId: '',
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
          [`${sheetId}_0_0`]: {
            value: 1,
            isBold: true,
          },
        },
        mergeCells: {
          [mergeCellKey({ sheetId, row: 20, col: 20, rowCount: 3, colCount: 3 })]: {
            row: 20,
            col: 20,
            rowCount: 3,
            colCount: 3,
            sheetId,
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
        autoFilter: {},
      };
      expect(controller.toJSON()).toEqual(result);
    });
    test('fromJSON', () => {
      const sheetId = '1';
      const result: ModelJSON = {
        scroll: {},
        currentSheetId: sheetId,
        rangeMap: {
          [sheetId]: { row: 3, col: 3, rowCount: 1, colCount: 1, sheetId },
        },
        workbook: {
          [sheetId]: {
            rowCount: 200,
            colCount: 100,
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
          [`${sheetId}_0_0`]: {
            formula: '=SUM(1,2)',
            value: '',
            isBold: true,
          },
        },
        mergeCells: {
          'Sheet1!$U$21:$X$24': {
            row: 20,
            col: 20,
            rowCount: 3,
            colCount: 3,
            sheetId,
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
        autoFilter: {},
      };
      controller.fromJSON(result);
      expect(controller.getCol(40).len).toEqual(300);
      expect(controller.getRow(50).len).toEqual(200);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
      expect(controller.getSheetList()).toHaveLength(1);
      expect(controller.getDefineNameList()).toHaveLength(1);
      expect(controller.getMergeCellList()).toHaveLength(1);
      expect(controller.getDrawingList()).toHaveLength(1);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId,
        }),
      ).toEqual({
        formula: '=SUM(1,2)',
        value: 3,
        isBold: true,
      });
    });
  });
});
