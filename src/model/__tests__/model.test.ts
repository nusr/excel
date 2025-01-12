import { Model } from '..';
import { SheetRange } from '../../util';
import { ModelJSON, RequestFormulas, IHooks } from '../../types';
import { getMockHooks } from './util';
import { Doc } from 'yjs';

describe('model.test.ts', () => {
  let model: Model;
  beforeEach(() => {
    model = new Model(getMockHooks());
  });
  test('should call computeFormulas', async () => {
    const mockTestHooks: any = {
      worker: {
        computeFormulas: jest.fn(),
      },
      doc: new Doc(),
    };

    const model = new Model(mockTestHooks as Pick<IHooks, 'doc' | 'worker'>);
    model.addSheet();
    model.setCellValue('=sum(1,1)', new SheetRange(0, 0, 1, 1, ''));
    await model.computeFormulas();
    const sheetId = model.getCurrentSheetId();
    const result: RequestFormulas = {
      currentSheetId: sheetId,
      definedNames: {},
      workbook: [model.getSheetInfo()!],
      worksheets: { [`${sheetId}_0_0`]: { formula: '=sum(1,1)', value: '' } },
    };
    expect(mockTestHooks.worker.computeFormulas).toHaveBeenCalledWith(
      result,
      expect.any(Function),
    );
  });
  test('normal', () => {
    expect(model.getSheetList()).toHaveLength(0);
    model.addSheet();
    expect(model.getSheetList()).toHaveLength(1);
  });
  test('setCellValue', () => {
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
    const result: ModelJSON = {
      scroll: {},
      workbook: {},
      mergeCells: {},
      worksheets: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      currentSheetId: '',
      drawings: {},
      rangeMap: {},
      autoFilter: {},
    };
    expect(model.toJSON()).toEqual(result);
  });
  test('fromJSON', () => {
    const json: ModelJSON = {
      scroll: {},
      currentSheetId: '',
      rangeMap: {},
      workbook: {
        '1': {
          sheetId: '1',
          isHide: false,
          rowCount: 200,
          colCount: 200,
          name: 'Sheet1',
          sort: 0,
        },
      },
      mergeCells: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      worksheets: {
        '1_0_0': {
          value: '1',
        },
        '1_2_2': {
          formula: '=Sheet1!A1',
          value: '1',
        },
      },
      drawings: {},
      autoFilter: {},
    };
    model.fromJSON(json);
    const result: ModelJSON = {
      scroll: {},
      currentSheetId: '',
      workbook: {
        '1': {
          sheetId: '1',
          isHide: false,
          rowCount: 200,
          colCount: 200,
          name: 'Sheet1',
          sort: 0,
        },
      },
      mergeCells: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      worksheets: {
        '1_0_0': {
          value: 1,
        },
        '1_2_2': {
          formula: '=Sheet1!A1',
          value: 1,
        },
      },
      drawings: {},
      rangeMap: {},
      autoFilter: {},
    };
    expect(model.toJSON()).toEqual(result);
  });
  test('fromJSON empty', () => {
    model.fromJSON({} as unknown as ModelJSON);
    const result: ModelJSON = {
      scroll: {},
      workbook: {},
      mergeCells: {},
      worksheets: {},
      customHeight: {},
      customWidth: {},
      definedNames: {},
      currentSheetId: '',
      drawings: {},
      rangeMap: {},
      autoFilter: {},
    };
    expect(model.toJSON()).toEqual(result);
  });
});
