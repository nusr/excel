import { applyUpdate, Doc, encodeStateAsUpdate } from 'yjs';
import { Model } from '../Model';
import { getMockHooks } from './util';
import { hydrateDocument, mergeCellKey, SharedRoot } from '../../protocol';
import type { DrawingElement, ModelJSON } from '../../types';

function setup() {
  const hooks = getMockHooks();
  const model = new Model(hooks);
  model.addSheet();
  const range = { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: model.getCurrentSheetId() };
  return { hooks, model, range };
}

describe('model review regressions', () => {
  test.each(['1', '1234', 'A B', "O'Brien", 'Sheet1'])(
    'legacy merges for %s survive hydration, rename, deduplication and unmerge',
    (name) => {
      const { model, range } = setup();
      model.renameSheet(name);
      const horizontal = { ...range, row: 2, rowCount: 1, colCount: 3 };
      const vertical = { ...range, col: 4, rowCount: 3, colCount: 1 };
      const json = model.toJSON();
      json.mergeCells = { [`'${name}'!$A$3:$C$3`]: horizontal, [`'${name}'!$E$1:$E$3`]: vertical };
      const doc = new Doc();
      hydrateDocument(doc, json);
      const restored = new Model({ ...getMockHooks(), doc });
      expect(restored.getMergeCellList()).toEqual([horizontal, vertical]);
      restored.renameSheet('Renamed');
      restored.addMergeCell(horizontal);
      expect(restored.getMergeCellList()).toHaveLength(2);
      restored.deleteMergeCell(horizontal);
      expect(restored.getMergeCellList()).toEqual([vertical]);
      const persisted = restored.toJSON();
      expect(Object.keys(persisted.mergeCells)).toEqual([mergeCellKey(vertical)]);
      const reloaded = setup().model;
      reloaded.fromJSON(persisted);
      reloaded.deleteMergeCell(vertical);
      expect(reloaded.getMergeCellList()).toEqual([]);
    },
  );

  test('old document merge keys remain removable without JSON rehydration', () => {
    const { model, range } = setup();
    const merged = { ...range, colCount: 2 };
    model.getRoot().get('mergeCells').set("'1'!$A$1:$B$1", merged);
    model.renameSheet('Renamed');
    model.deleteMergeCell(merged);
    expect(model.getMergeCellList()).toEqual([]);
  });

  test('renaming and reusing the old sheet name cannot overwrite its merges', () => {
    const { model, range } = setup();
    const first = { ...range, colCount: 2 };
    model.addMergeCell(first);
    model.renameSheet('Renamed');
    const next = model.addSheet();
    model.renameSheet('Sheet1');
    model.addMergeCell({ ...first, sheetId: next.sheetId });
    expect(model.getMergeCellList(first.sheetId)).toEqual([first]);
    expect(model.getMergeCellList(next.sheetId)).toHaveLength(1);
  });

  test('refusing to delete the last visible sheet preserves its contents', () => {
    const { model, range } = setup();
    model.setCellValue(42, range);
    model.addMergeCell({ ...range, colCount: 2 });
    model.setRowHeight(0, 40);
    const before = model.toJSON();
    model.deleteSheet();
    expect(model.toJSON()).toEqual(before);
  });

  test('a hidden sheet can be deleted without switching the active sheet', () => {
    const { model, range } = setup();
    const hidden = model.addSheet();
    model.hideSheet(hidden.sheetId);
    model.setCellValue(42, range);
    model.deleteSheet(hidden.sheetId);
    expect(model.getSheetList()).toHaveLength(1);
    expect(model.getCurrentSheetId()).toBe(range.sheetId);
    expect(model.getCell(range)?.value).toBe(42);
  });

  test('deleting a nonactive visible sheet leaves the current sheet selected', () => {
    const { model, range } = setup();
    model.addSheet();
    const current = model.addSheet();
    model.deleteSheet(range.sheetId);
    expect(model.getCurrentSheetId()).toBe(current.sheetId);
  });

  test.each([false, true])('overlapping paste snapshots the entire source (cut=%s)', (cut) => {
    const { model, range } = setup();
    model.setCell([[1, 2, 3]], [], range);
    model.setActiveRange({ ...range, col: 1 });
    model.pasteRange({ ...range, colCount: 3 }, cut);
    expect([1, 2, 3].map((col) => model.getCell({ ...range, col })?.value)).toEqual([1, 2, 3]);
    expect(model.getCell(range)?.value).toBe(cut ? undefined : 1);
  });

  test('cutting a range onto itself preserves its contents', () => {
    const { model, range } = setup();
    model.setCellValue(42, range);
    model.setActiveRange(range);
    model.pasteRange(range, true);
    expect(model.getCell(range)?.value).toBe(42);
  });

  test('pasting a blank range clears the target, and clips at worksheet bounds', () => {
    const { model, range } = setup();
    model.setCellValue(42, range);
    model.setActiveRange(range);
    model.pasteRange({ ...range, row: 1 }, false);
    expect(model.getCell(range)?.value).toBe('');
    const { colCount, rowCount } = model.getSheetInfo()!;
    model.setActiveRange({ ...range, row: rowCount - 1, col: colCount - 1 });
    expect(model.pasteRange({ ...range, rowCount: 2, colCount: 2 }, false)).toMatchObject({
      rowCount: 1,
      colCount: 1,
    });
  });

  test('bulk cell writes clip at the last row and column', () => {
    const { model, range } = setup();
    const edge = { ...range, row: 199, col: 29 };
    model.setCell(
      [
        [1, 2],
        [3, 4],
      ],
      [],
      edge,
    );
    expect(model.getCell(edge)?.value).toBe(1);
    expect(model.getWorksheet()).toHaveLength(1);
  });

  test('invalid single-cell coordinates cannot create aliased cells', () => {
    const { model, range } = setup();
    expect(() => model.setCellValue(42, { ...range, col: 0.5 })).toThrow(RangeError);
    expect(model.getWorksheet()).toEqual([]);
  });

  test('duplicate merges do not discard newly edited cell contents', () => {
    const { model, range } = setup();
    const merged = { ...range, colCount: 2 };
    model.addMergeCell(merged);
    model.setCellValue(42, { ...range, col: 1 });
    model.addMergeCell(merged);
    expect(model.getCell({ ...range, col: 1 })?.value).toBe(42);
  });

  test('filtering a nonactive sheet only changes that sheet row visibility', () => {
    const { model, range } = setup();
    model.setCell([[1], [2]], [], { ...range, row: 1 });
    model.addFilter({ ...range, rowCount: 3 });
    model.addSheet();
    const activeSheet = model.getCurrentSheetId();
    model.updateFilter(range.sheetId, { col: 0, value: { type: 'normal', value: [1] } });
    expect(model.getCurrentSheetId()).toBe(activeSheet);
    expect(model.getRow(2).isHide).toBe(false);
    expect(model.getRow(2, range.sheetId).isHide).toBe(true);
    model.updateFilter(range.sheetId, { col: undefined, value: undefined });
    expect(model.getRow(2, range.sheetId).isHide).toBe(false);
  });

  test('drawing import skips invalid entries and accepts zero-valued data on a nonactive sheet', () => {
    const { model, range } = setup();
    const chart: DrawingElement = {
      uuid: 'chart',
      type: 'chart',
      title: 'chart',
      sheetId: range.sheetId,
      fromRow: 199,
      fromCol: 29,
      width: 100,
      height: 100,
      originHeight: 100,
      originWidth: 100,
      marginX: 0,
      marginY: 0,
      chartType: 'line',
      chartRange: range,
    };
    const json = model.toJSON();
    json.drawings = { invalid: { ...chart, uuid: '' }, chart };
    model.fromJSON(json);
    expect(model.getDrawingList()).toHaveLength(1);
    model.deleteDrawing(chart.uuid);
    model.setCellValue(0, range);
    model.addSheet();
    model.addDrawing(chart);
    expect(model.getDrawingList(range.sheetId)).toHaveLength(1);
  });

  test('drawing anchors follow insertions at the last row and column', () => {
    const { model, range } = setup();
    model.addDrawing({
      uuid: 'picture',
      type: 'floating-picture',
      title: 'picture',
      sheetId: range.sheetId,
      fromRow: 199,
      fromCol: 29,
      width: 100,
      height: 100,
      originHeight: 100,
      originWidth: 100,
      marginX: 0,
      marginY: 0,
      imageSrc: 'data:image/png;base64,',
    });
    model.addRow(199, 2, true);
    model.addCol(29, 2);
    expect(model.getDrawingList()[0]).toMatchObject({ fromRow: 201, fromCol: 31 });
    model.deleteRow(200, 2);
    model.deleteCol(30, 2);
    expect(model.getDrawingList()[0]).toMatchObject({ fromRow: 199, fromCol: 29 });
  });

  test('local undo preserves independently synchronized remote cell formatting', () => {
    const { model, hooks, range } = setup();
    model.setCellValue(0, range);
    const peerHooks = getMockHooks();
    applyUpdate(peerHooks.doc, encodeStateAsUpdate(hooks.doc));
    const peer = new Model(peerHooks);
    model.transaction(() => model.setCellValue(42, range));
    peer.transaction(() => peer.updateCellStyle({ isBold: true }, range));
    applyUpdate(hooks.doc, encodeStateAsUpdate(peerHooks.doc));
    model.undo();
    expect(model.getCell(range)).toMatchObject({ value: 0, isBold: true });
    model.redo();
    expect(model.getCell(range)).toMatchObject({ value: 42, isBold: true });
  });

  test.each([NaN, Infinity, 0.5])('range validation rejects noninteger coordinates %s', (value) => {
    const { model, range } = setup();
    for (const key of ['row', 'col', 'rowCount', 'colCount'] as const) {
      expect(model.validateRange({ ...range, [key]: value })).toBe(false);
    }
  });

  test('moving the first nonempty merged cell preserves numeric value, style and formula', () => {
    const { model, range } = setup();
    model.setWorksheet([{ ...range, row: 1, value: 3, formula: '=SUM(1,2)', isBold: true }]);
    model.addMergeCell({ ...range, rowCount: 2 });
    expect(model.getCell(range)).toMatchObject({ value: 3, formula: '=SUM(1,2)', isBold: true });
    expect(model.getCell({ ...range, row: 1 })).toBeUndefined();
  });

  test('sheet names are case-insensitively unique', () => {
    const { model } = setup();
    const second = model.addSheet();
    model.renameSheet('sheet1');
    expect(model.getSheetInfo(second.sheetId)?.name).toBe('Sheet2');
  });

  test('invalid hydration does not clear an already populated document', () => {
    const { model, hooks, range } = setup();
    model.setCellValue(42, range);
    const before = model.toJSON();
    const invalid = {
      ...before,
      workbook: {
        [range.sheetId]: { ...before.workbook[range.sheetId], rowCount: 0 },
      },
    };
    expect(() => hydrateDocument(hooks.doc, invalid)).toThrow('Invalid worksheet dimensions');
    expect(model.toJSON()).toEqual(before);
    expect(() =>
      hydrateDocument(hooks.doc, {
        ...before,
        customHeight: {
          missing_0: { len: 30, isHide: false },
        },
      }),
    ).toThrow('Invalid custom size');
    expect(model.toJSON()).toEqual(before);
  });

  test('underscored sheet IDs round-trip cells and sizes through Yjs and JSON', () => {
    const { model } = setup();
    const json: ModelJSON = {
      ...model.toJSON(),
      workbook: {
        sheet_with_underscore: {
          sheetId: 'sheet_with_underscore',
          name: 'Named',
          sort: 1,
          isHide: false,
          rowCount: 3,
          colCount: 3,
        },
      },
      worksheets: { sheet_with_underscore_1_2: { value: 42 } },
      customHeight: { sheet_with_underscore_1: { len: 40, isHide: false } },
      customWidth: { sheet_with_underscore_2: { len: 100, isHide: false } },
    };
    const doc = new Doc();
    hydrateDocument(doc, json);
    const peer = new Doc();
    applyUpdate(peer, encodeStateAsUpdate(doc));
    expect(new SharedRoot(peer).toJSON().worksheets).toEqual(json.worksheets);
    expect(new SharedRoot(peer).toJSON().customHeight).toEqual(json.customHeight);
    model.fromJSON(new SharedRoot(peer).toJSON());
    expect(model.toJSON().worksheets).toEqual(json.worksheets);
    model.deleteAll('sheet_with_underscore');
    expect(model.toJSON().worksheets).toEqual({});
    expect(model.toJSON().customHeight).toEqual({});
  });
});
