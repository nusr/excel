import { Model } from '../Model';
import { XLSX_MAX_ROW_COUNT, XLSX_MAX_COL_COUNT } from '@/util';
import { Workbook } from '../workbook';

describe('workbook.test.ts', () => {
  let model: Model;
  beforeEach(() => {
    model = new Model();
  });
  describe('validateSheet', () => {
    test('ok', () => {
      const w = new Workbook(model);
      expect(
        w.validateSheet({
          sheetId: 'test',
          name: 'aa',
          isHide: false,
          sort: 1,
          colCount: 10,
          rowCount: 10,
        }),
      ).toEqual(true);
    });
    test('invalid', () => {
      const w = new Workbook(model);
      expect(w.validateSheet(undefined as any)).toEqual(false);
      expect(w.validateSheet(null as any)).toEqual(false);

      expect(w.validateSheet({ sheetId: '' } as any)).toEqual(false);
      expect(w.validateSheet({ sheetId: 'test', name: '' } as any)).toEqual(
        false,
      );

      expect(
        w.validateSheet({
          sheetId: 'test',
          name: '',
          isHide: false,
          sort: 1,
          colCount: 1,
          rowCount: XLSX_MAX_ROW_COUNT + 10,
        }),
      ).toEqual(false);
      expect(
        w.validateSheet({
          sheetId: 'test',
          name: '',
          isHide: false,
          sort: 1,
          colCount: XLSX_MAX_COL_COUNT + 10,
          rowCount: +10,
        }),
      ).toEqual(false);
    });
  });
  describe('JSON', () => {
    test('empty', () => {
      model.fromJSON({} as any);
      expect(model.toJSON().workbook).toEqual({});
    });
    test('ok', () => {
      model.fromJSON({
        workbook: {
          '1': {
            sheetId: '1',
            name: '1',
            isHide: false,
            sort: 1,
            colCount: 10,
            rowCount: 10,
          },
          '2': {
            sheetId: 'te2st',
            name: '2',
            isHide: false,
            sort: 2,
            colCount: 10,
            rowCount: 10 + XLSX_MAX_ROW_COUNT,
          },
        },
        currentSheetId: undefined,
      } as any);
      const jsonData = model.toJSON();
      expect(jsonData.currentSheetId).toEqual('1');
      expect(jsonData.workbook).toEqual({
        '1': {
          sheetId: '1',
          name: '1',
          isHide: false,
          sort: 1,
          colCount: 10,
          rowCount: 10,
        },
      });
    });
  });
  describe('updateSheetInfo', () => {
    test('empty', () => {
      const oldData = model.toJSON();
      model.updateSheetInfo({}, 'aa');
      expect(model.toJSON().workbook).toEqual(oldData.workbook);
    });
    test('only sheetId', () => {
      model.addSheet();
      const oldData = model.toJSON();
      const sheetId = model.getCurrentSheetId();
      model.updateSheetInfo({ sheetId });
      expect(model.toJSON()).toEqual(oldData);
    });
    test('same value', () => {
      model.addSheet();
      const oldData = model.toJSON();
      model.updateSheetInfo({ colCount: 30 });
      expect(model.toJSON()).toEqual(oldData);
    });
    test('ok', () => {
      model.addSheet();
      const oldData = model.getSheetInfo()
      model.updateSheetInfo(
        { colCount: 10, rowCount: 10 },
        model.getCurrentSheetId(),
      );
      expect(model.getSheetInfo()).not.toEqual(oldData);
    });
  });
  describe('deleteSheet', () => {
    test('not found', () => {
      model.addSheet();
      model.addSheet();
      model.addSheet();
      expect(() => model.deleteSheet('aaa')).toThrow();
    });
    test('throw error', () => {
      model.addSheet();
      expect(() => model.deleteSheet(model.getCurrentSheetId())).toThrow();
    });
  });
  describe('hideSheet', () => {
    test('ok', () => {
      model.addSheet();
      model.addSheet();
      const sheetId = model.getCurrentSheetId();
      model.hideSheet();
      expect(model.getCurrentSheetId()).not.toEqual(sheetId);
      model.unhideSheet(sheetId);
      expect(model.getCurrentSheetId()).toEqual(sheetId);
    });
  });
});
