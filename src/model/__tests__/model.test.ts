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
});
