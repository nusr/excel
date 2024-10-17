import { Model } from '..';
import { SheetRange } from '@/util';
import { WorkBookJSON, RemoteWorkerType } from '@/types';

describe('model.test.ts', () => {
  const mockWorker = {
    computeFormulas: jest.fn()
  }
  beforeEach(() => {
    mockWorker.computeFormulas.mockReset()
  })
  test('should call computeFormulas', async () => {
    const model = new Model(mockWorker as unknown as RemoteWorkerType);
    model.setCellValue('=sum(1,1)', new SheetRange(0, 0, 1, 1, ''));
    model.emitChange(new Set(['cellValue']))
    expect(mockWorker.computeFormulas).toHaveBeenCalledWith({ "currentSheetId": "", "definedNames": {}, "workbook": [], "worksheets": { "": { "0_0": { "formula": "=sum(1,1)" } } } }, expect.any(Function))
  });
  test('normal', () => {
    const model = new Model();
    expect(model.getSheetList()).toHaveLength(0);
    model.addSheet();
    expect(model.getSheetList()).toHaveLength(1);
  });
  test('setCellValue', () => {
    const model = new Model();
    model.addSheet();
    expect(model.getCell(new SheetRange(0, 0, 1, 1, ''))).toBeUndefined();
    model.setCell(
      [['test']],
      [],
      new SheetRange(0, 0, 1, 1, model.getCurrentSheetId()),
    );
    expect(model.getCell(new SheetRange(0, 0, 1, 1, ''))).toEqual({
      value: 'test',
    });
  });
  test('toJSON', () => {
    const model = new Model();
    expect(model.toJSON()).toEqual({
      workbook: {},
      mergeCells: {},
      worksheets: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      currentSheetId: '',
      drawings: {},
      rangeMap: {},
    });
  });
  test('fromJSON', () => {
    const model = new Model();
    const json: WorkBookJSON = {
      currentSheetId: '',
      rangeMap: {},
      workbook: {
        '1': {
          sheetId: '1',
          isHide: false,
          rowCount: 200,
          colCount: 200,
          name: 'test',
          sort: 0,
        },
      },
      mergeCells: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      worksheets: {
        '2': {
          '0_0': {
            formula: '=Sheet1!A1',
            value: '',
          },
        },
      },
      drawings: {},
    };
    model.fromJSON(json);
    expect(model.toJSON()).toEqual({
      currentSheetId: '1',
      workbook: {
        '1': {
          sheetId: '1',
          isHide: false,
          rowCount: 200,
          colCount: 200,
          name: 'test',
          sort: 0,
        },
      },
      mergeCells: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      worksheets: {
        '2': {
          '0_0': {
            formula: '=Sheet1!A1',
            value: '',
          },
        },
      },
      drawings: {},
      rangeMap: {},
    });
  });
  test('fromJSON empty', () => {
    const model = new Model();
    model.fromJSON({} as unknown as WorkBookJSON);
    expect(model.toJSON()).toEqual({
      workbook: {},
      mergeCells: {},
      worksheets: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      currentSheetId: '',
      drawings: {},
      rangeMap: {},
    });
  });


});
