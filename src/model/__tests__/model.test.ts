import { Model } from '..';
import { Range } from '@/util';
import { WorkBookJSON } from '@/types';
import { BaseCommand } from '../Command';

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
    expect(model.getCell(new Range(0, 0, 1, 1, ''))).toEqual({
      style: undefined,
      row: 0,
      col: 0,
    });
    model.setCellValues(
      [['test']],
      [],
      [new Range(0, 0, 1, 1, model.getCurrentSheetId())],
    );
    expect(model.getCell(new Range(0, 0, 1, 1, ''))).toEqual({
      style: undefined,
      value: 'test',
      formula: '',
      row: 0,
      col: 0,
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
          },
        },
      },
      drawings: {},
      rangeMap: {},
    });
  });

  test('BaseCommand', () => {
    const model = new Model();
    const oldSheetId = '1';
    const newSheetId = '2';
    const command = new BaseCommand(
      model,
      'currentSheetId',
      newSheetId,
      oldSheetId,
    );
    expect(model.getCurrentSheetId()).toEqual('');
    command.execute();
    expect(model.getCurrentSheetId()).toEqual(newSheetId);

    command.undo();
    expect(model.getCurrentSheetId()).toEqual(oldSheetId);

    command.redo();
    expect(model.getCurrentSheetId()).toEqual(newSheetId);
  });
});
