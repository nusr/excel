import { Model } from '..';
import { Range } from '@/util';

describe('model.test.ts', () => {
  test('normal', () => {
    const model = new Model();
    expect(model.getSheetList()).toHaveLength(0);
    model.addSheet();
    expect(model.getSheetList()).toHaveLength(1);
  });
  test('setCellValue', () => {
    const model = new Model();
    model.addSheet();
    expect(model.queryCell(0, 0)).toEqual({ style: undefined });
    model.setCellValues(
      [['test']],
      [],
      [new Range(0, 0, 1, 1, model.getCurrentSheetId())],
    );
    expect(model.queryCell(0, 0)).toEqual({
      style: undefined,
      value: 'test',
      formula: '',
    });
  });
  test('toJSON', () => {
    const model = new Model();
    expect(model.toJSON()).toEqual({
      workbook: [],
      worksheets: {},
      mergeCells: [],
      customHeight: {},
      customWidth: {},
    });
  });
  test('fromJSON', () => {
    const model = new Model();
    model.fromJSON({
      workbook: [
        {
          sheetId: '1',
          activeCell: {
            row: 0,
            col: 1,
          },
          rowCount: 200,
          colCount: 200,
          name: 'test',
        },
      ],
      worksheets: {},
      mergeCells: [
        {
          row: 1,
          col: 1,
          colCount: 3,
          rowCount: 3,
          sheetId: '1',
        },
      ],
      customHeight: {},
      customWidth: {},
    }),
      expect(model.toJSON()).toEqual({
        workbook: [
          {
            sheetId: '1',
            activeCell: {
              row: 0,
              col: 1,
            },
            rowCount: 200,
            colCount: 200,
            name: 'test',
          },
        ],
        worksheets: {},
        mergeCells: [
          {
            row: 1,
            col: 1,
            colCount: 3,
            rowCount: 3,
            sheetId: '1',
          },
        ],
        customHeight: {},
        customWidth: {},
      });
  });
});
