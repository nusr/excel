import { Model } from '../Model';
import { getMockHooks } from './util';

describe('rangeMap.test.ts', () => {
  let model: Model;
  beforeEach(() => {
    model = new Model(getMockHooks());
  });
  describe('validateRange', () => {
    test('invalid', () => {
      model.addSheet();
      expect(
        model.validateRange({
          row: 0,
          col: 0,
          colCount: 2,
          rowCount: 2,
          sheetId: 'aaaa',
        }),
      ).toEqual(false);

      expect(
        model.validateRange({
          row: -1,
          col: 0,
          colCount: 2,
          rowCount: 2,
          sheetId: '',
        }),
      ).toEqual(false);
      expect(
        model.validateRange({
          row: 0,
          col: -1,
          colCount: 2,
          rowCount: 2,
          sheetId: '',
        }),
      ).toEqual(false);
      expect(
        model.validateRange({
          row: 0,
          col: 100,
          colCount: 150,
          rowCount: 2,
          sheetId: '',
        }),
      ).toEqual(false);
    });
    test('ok', () => {
      model.addSheet();
      expect(
        model.validateRange({
          row: 0,
          col: 0,
          colCount: 2,
          rowCount: 2,
          sheetId: '',
        }),
      ).toEqual(true);
    });
  });
});
