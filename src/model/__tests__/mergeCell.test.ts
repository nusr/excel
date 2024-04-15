import { Model } from '../Model';

describe('mergeCell.test.ts', () => {
  let model: Model;
  beforeEach(() => {
    model = new Model();
  });
  describe('JSON', () => {
    test('ok', () => {
      model.addSheet();
      model.fromJSON({
        workbook: {
          '1': {
            sheetId: '1',
            name: '1',
            isHide: false,
            sort: 1,
            colCount: 100,
            rowCount: 100,
          },
        },
        mergeCells: {
          test: {
            row: -1,
            col: 1,
            colCount: 1,
            rowCount: 1,
            sheetId: '',
          },
          testa: {
            row: 0,
            col: 0,
            colCount: 2,
            rowCount: 2,
            sheetId: '',
          },
        },
        worksheets: {},
        customHeight: {},
        customWidth: {},
        definedNames: {},
        currentSheetId: '',
        drawings: {},
        rangeMap: {},
      });

      expect(model.toJSON().mergeCells).toEqual({
        '1!$A$1:$B$2': {
          row: 0,
          col: 0,
          colCount: 2,
          rowCount: 2,
          sheetId: '1',
        },
      });
    });
  });
});
