import { Controller } from '..';
import { Model } from '@/model';
import { mockHooks } from '../init'
import { DEFAULT_TEXT_FORMAT_CODE } from '@/util'

describe('worksheet.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), mockHooks);
    controller.addSheet();
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
      ).toBeUndefined();
    });
    test('set value', () => {
      controller.setCell([[1]], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1 });
    });
    test('set formula', () => {
      controller.setCell([['=SUM(1,2)']], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ formula: '=SUM(1,2)', value: 3 });
    });
    test('set text formula', () => {
      controller.setCell([['=SUM(1,2)']], [[{ numberFormat: DEFAULT_TEXT_FORMAT_CODE }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: '=SUM(1,2)', style: { "numberFormat": DEFAULT_TEXT_FORMAT_CODE, } });
    });
    test('set date', () => {
      controller.setCell([[1]], [[{ numberFormat: 'h:mm:ss AM/PM' }]], {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.setCellValue(new Date('2023-12-11 10:10:10').toString(), {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        Math.floor(
          controller.getCell({
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          })!.value as number,
        ),
      ).toEqual(Math.floor(45271));
    });
    test('setFormula setValue', () => {
      controller.setCell([['=SUM(1,2)']], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ formula: '=SUM(1,2)', value: 3 });

      controller.setCell([['test']], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ formula: '', value: 'test' });
    });
    test('copy', async () => {
      controller.setCell([['=SUM(1,2)']], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.copy();
      controller.setActiveRange({
        row: 5,
        col: 5,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.paste();
      expect(
        controller.getCell({
          row: 5,
          col: 5,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({
        formula: '=SUM(1,2)',
        value: 3,
        style: { isBold: true },
      });
    });
    test('cut', async () => {
      controller.setCell([['=SUM(1,2)']], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.cut();
      controller.setActiveRange({
        row: 5,
        col: 5,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.paste();
      expect(
        controller.getCell({
          row: 5,
          col: 5,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({
        formula: '=SUM(1,2)',
        value: 3,
        style: { isBold: true },
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeUndefined();
    });
    test('undo redo', () => {
      controller.setCell([[1]], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1 });
      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeUndefined();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1 });
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
      ).toBeUndefined();
    });
    test('set', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, style: { isBold: true } });
    });
    test('update', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, style: { isBold: true } });
      controller.updateCellStyle(
        { isBold: false, isItalic: true },
        {
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({
        value: 1,
        style: { isBold: false, isItalic: true },
      });
    });
    test('undo redo', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, style: { isBold: true } });

      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeUndefined();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, style: { isBold: true } });
    });
  });
  describe('worksheet', () => {
    test('get', () => {
      controller.setCell([['1']], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });

      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({
        value: 1,
        style: { isBold: true },
      });
    });
    test('set', () => {
      controller.setCell([[1]], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        })?.value,
      ).toEqual(1);

      controller.setWorksheet({
        '0_0': { value: 'test', style: { isBold: true } },
      });

      expect(controller.getWorksheet()).toEqual({
        '0_0': { value: 'test', style: { isBold: true } },
      });
    });
  });
  describe('cycle import', () => {
    test('ok', () => {
      controller.setCell([['=A2'], ['=A1']], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        })?.value,
      ).toBeUndefined()
      expect(
        controller.getCell({
          row: 1,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        })?.value
      ).toBeUndefined()
    });
  });
});
